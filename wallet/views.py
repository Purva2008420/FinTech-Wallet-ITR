from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import Wallet
from .serializers import WalletSerializer, AddMoneySerializer, TransferSerializer
from transactions.models import Transaction

User = get_user_model()

class WalletDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = WalletSerializer(request.user.wallet)
        return Response(serializer.data)

class AddMoneyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddMoneySerializer(data=request.data)
        if serializer.is_valid():
            amount = serializer.validated_data["amount"]
            if amount <= 0:
                return Response({"error": "Amount must be greater than zero."}, status=400)

            wallet = request.user.wallet
            wallet.balance += Decimal(amount)
            wallet.save()

            Transaction.objects.create(
                user=request.user,
                transaction_type="DEPOSIT",
                amount=amount,
                description="Money added to wallet"
            )
            return Response({"message": "Money added successfully.", "new_balance": wallet.balance})
        return Response(serializer.errors, status=400)

class TransferMoneyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransferSerializer(data=request.data)

        if serializer.is_valid():
            receiver_username = str(serializer.validated_data["receiver_username"])
            amount = Decimal(serializer.validated_data["amount"])

            # 1. Validation: Block zero or negative values
            if amount <= 0:
                return Response({"error": "Amount must be greater than zero."}, status=400)

            # 2. Validation: Prevent self-transfer
            if receiver_username == request.user.username:
                return Response({"error": "You cannot transfer money to yourself."}, status=400)

            # 3. Validation: Verify recipient account exists
            try:
                receiver = User.objects.get(username=receiver_username)
            except User.DoesNotExist:
                return Response({"error": "Receiver not found."}, status=404)

            sender_wallet = request.user.wallet
            receiver_wallet = receiver.wallet

            # 4. Validation: Verify sender has enough funds
            if sender_wallet.balance < amount:
                return Response({"error": "Insufficient balance."}, status=400)

            # Safe database execution block
            with transaction.atomic():
                sender_wallet.balance -= amount
                receiver_wallet.balance += amount

                sender_wallet.save()
                receiver_wallet.save()

                # Audit record for Sender
                Transaction.objects.create(
                    user=request.user,
                    sender=request.user,
                    receiver=receiver,
                    transaction_type="TRANSFER",
                    amount=amount,
                    description=f"Transferred to {receiver.username}"
                )

                # Audit record for Recipient
                Transaction.objects.create(
                    user=receiver,
                    sender=request.user,
                    receiver=receiver,
                    transaction_type="TRANSFER",
                    amount=amount,
                    description=f"Received from {request.user.username}"
                )

            return Response({
                "message": "Transfer successful.",
                "balance": sender_wallet.balance
            })

        return Response(serializer.errors, status=400)