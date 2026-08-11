from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import Wallet
from .serializers import WalletSerializer, AddMoneySerializer, TransferSerializer
from transactions.models import Transaction
from fraud_detection.services import detect_fraud

User = get_user_model()

class WalletDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_frozen:
            return Response(
                {"error": "Your account has been frozen. Please contact the administrator."},
                status=403
            )

        serializer = WalletSerializer(request.user.wallet)
        return Response(serializer.data)


class AddMoneyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_frozen:
            return Response(
                {"error": "Your account has been frozen. Please contact the administrator."},
                status=403
            )

        serializer = AddMoneySerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data["amount"]
            if amount <= 0:
                return Response({"error": "Amount must be greater than zero."}, status=400)

            wallet = request.user.wallet
            wallet.balance += Decimal(amount)
            wallet.save()

            transaction = Transaction.objects.create(
                user=request.user,
                transaction_type="DEPOSIT",
                amount=amount,
                status="SUCCESS",
                description="Money added to wallet"
            )

            detect_fraud(transaction)
            return Response({"message": "Money added successfully.", "new_balance": wallet.balance})
        return Response(serializer.errors, status=400)

class WithdrawMoneyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_frozen:
            return Response(
                {
                    "error": "Your account has been frozen. Please contact the administrator."
                },
                status=403
            )

        serializer = AddMoneySerializer(data=request.data)

        if serializer.is_valid():
            amount = Decimal(
                serializer.validated_data["amount"]
            )

            # 1. Validate amount
            if amount <= 0:
                return Response(
                    {"error": "Amount must be greater than zero."},
                    status=400
                )

            wallet = request.user.wallet

            # 2. Check sufficient balance
            if wallet.balance < amount:
                failed_transaction = Transaction.objects.create(
                    user=request.user,
                    transaction_type="WITHDRAW",
                    amount=amount,
                    status="FAILED",
                    description="Withdrawal failed: Insufficient balance."
                )

                return Response(
                    {
                        "message": "Withdrawal failed.",
                        "status": "FAILED",
                        "error": "Insufficient wallet balance.",
                        "transaction_id": failed_transaction.id,
                        "balance": wallet.balance
                    },
                    status=400
                )

            # 3. Deduct money safely
            with transaction.atomic():

                wallet.balance -= amount
                wallet.save()

                withdrawal_transaction = Transaction.objects.create(
                    user=request.user,
                    transaction_type="WITHDRAW",
                    amount=amount,
                    status="SUCCESS",
                    description="Money withdrawn from wallet"
                )

            # 4. Run fraud detection
            detect_fraud(withdrawal_transaction)

            return Response(
                {
                    "message": "Withdrawal successful.",
                    "status": "SUCCESS",
                    "transaction_id": withdrawal_transaction.id,
                    "balance": wallet.balance
                },
                status=200
            )

        return Response(
            serializer.errors,
            status=400
        )
class TransferMoneyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_frozen:
            return Response(
                {
                    "error": "Your account has been frozen. Please contact the administrator."
                },
                status=403
            )

        serializer = TransferSerializer(data=request.data)

        if serializer.is_valid():
            receiver_username = str(
                serializer.validated_data["receiver_username"]
            )
            amount = Decimal(
                serializer.validated_data["amount"]
            )

            # 1. Validate amount
            if amount <= 0:
                return Response(
                    {"error": "Amount must be greater than zero."},
                    status=400
                )

            # 2. Prevent self-transfer
            if receiver_username == request.user.username:
                return Response(
                    {"error": "You cannot transfer money to yourself."},
                    status=400
                )

            # 3. Find receiver
            try:
                receiver = User.objects.get(
                    username=receiver_username
                )
            except User.DoesNotExist:
                return Response(
                    {"error": "Receiver not found."},
                    status=404
                )

            # 4. Get wallets
            sender_wallet = request.user.wallet
            receiver_wallet = receiver.wallet

            # 5. Check balance
            if sender_wallet.balance < amount:
                failed_transaction = Transaction.objects.create(
                    user=request.user,
                    sender=request.user,
                    receiver=receiver,
                    transaction_type="TRANSFER",
                    amount=amount,
                    status="FAILED",
                    description="Transfer failed: Insufficient balance."
                )

                return Response(
                    {
                        "message": "Transaction failed.",
                        "status": "FAILED",
                        "error": "Insufficient balance.",
                        "transaction_id": failed_transaction.id,
                        "balance": sender_wallet.balance
                    },
                    status=400
                )

            # 6. Create transaction for fraud checking
            transaction_record = Transaction.objects.create(
                user=request.user,
                sender=request.user,
                receiver=receiver,
                transaction_type="TRANSFER",
                amount=amount,
                status="PENDING",
                description="Transaction under fraud review."
            )

            # 7. Run fraud detection
            decision = detect_fraud(transaction_record)

            # 8. HIGH risk → FAILED
            if decision == "FAILED":
                transaction_record.status = "FAILED"
                transaction_record.description = (
                    "Transaction failed due to high fraud risk."
                )
                transaction_record.save()

                return Response(
                    {
                        "message": "Transaction failed due to fraud detection.",
                        "status": "FAILED",
                        "transaction_id": transaction_record.id,
                        "balance": sender_wallet.balance
                    },
                    status=200
                )

            # 9. MEDIUM risk → PENDING
            if decision == "PENDING":
                transaction_record.status = "PENDING"
                transaction_record.description = (
                    "Transaction is pending for security review."
                )
                transaction_record.save()

                return Response(
                    {
                        "message": "Transaction is pending for security review.",
                        "status": "PENDING",
                        "transaction_id": transaction_record.id,
                        "balance": sender_wallet.balance
                    },
                    status=200
                )

            # 10. No fraud detected → SUCCESS
            with transaction.atomic():
                sender_wallet.balance -= amount
                receiver_wallet.balance += amount

                sender_wallet.save()
                receiver_wallet.save()

                transaction_record.status = "SUCCESS"
                transaction_record.description = (
                    f"Transferred to {receiver.username}"
                )
                transaction_record.save()

                # Recipient transaction history
                Transaction.objects.create(
                    user=receiver,
                    sender=request.user,
                    receiver=receiver,
                    transaction_type="TRANSFER",
                    amount=amount,
                    status="SUCCESS",
                    description=f"Received from {request.user.username}"
                )

            return Response(
                {
                    "message": "Transfer successful.",
                    "status": "SUCCESS",
                    "transaction_id": transaction_record.id,
                    "balance": sender_wallet.balance
                },
                status=200
            )

        return Response(
            serializer.errors,
            status=400
        )

