from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal
from .models import Wallet
from .serializers import WalletSerializer, AddMoneySerializer
from transactions.models import Transaction

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

            # Input validation: Block zero or negative deposits
            if amount <= 0:
                return Response(
                    {"error": "Amount must be greater than zero."},
                    status=400
                )

            # Atomic balance update
            wallet = request.user.wallet
            wallet.balance += Decimal(amount)
            wallet.save()

            # Create immutable audit record
            Transaction.objects.create(
                user=request.user,
                transaction_type="DEPOSIT",
                amount=amount,
                description="Money added to wallet"
            )

            return Response({
                "message": "Money added successfully.",
                "new_balance": wallet.balance
            })

        return Response(serializer.errors, status=400)