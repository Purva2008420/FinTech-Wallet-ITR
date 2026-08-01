from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.db.models import Sum
from wallet.models import Wallet
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer
from .permissions import IsAdminUserCustom

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "phone": request.user.phone
        })
User = get_user_model()

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUserCustom]

    def get(self, request):

        total_users = User.objects.count()
        total_wallets = Wallet.objects.count()
        total_transactions = Transaction.objects.count()

        total_balance = Wallet.objects.aggregate(
            total=Sum("balance")
        )["total"] or 0

        latest_transactions = Transaction.objects.order_by(
            "-created_at"
        )[:5]

        serializer = TransactionSerializer(
            latest_transactions,
            many=True
        )

        return Response({
            "total_users": total_users,
            "total_wallets": total_wallets,
            "total_transactions": total_transactions,
            "total_balance": total_balance,
            "latest_transactions": serializer.data
        })