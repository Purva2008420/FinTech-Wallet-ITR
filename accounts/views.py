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
            "phone": request.user.phone,
            "is_staff": request.user.is_staff
        })
User = get_user_model()
from fraud_detection.models import FraudAlert

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        total_users = User.objects.count()
        total_wallets = Wallet.objects.count()
        total_transactions = Transaction.objects.count()

        total_balance = Wallet.objects.aggregate(
            total=Sum("balance")
        )["total"] or 0

        # Day 13 Core: Real-time fraud metrics calculations
        total_alerts = FraudAlert.objects.count()
        resolved_alerts = FraudAlert.objects.filter(is_resolved=True).count()
        pending_alerts = FraudAlert.objects.filter(is_resolved=False).count()

        latest_transactions = Transaction.objects.order_by("-created_at")[:5]
        serializer = TransactionSerializer(latest_transactions, many=True)

        return Response({
            "total_users": total_users,
            "total_wallets": total_wallets,
            "total_transactions": total_transactions,
            "total_balance": total_balance,
            "total_fraud_alerts": total_alerts,
            "resolved_alerts": resolved_alerts,
            "pending_alerts": pending_alerts,
            "latest_transactions": serializer.data
        })



from rest_framework_simplejwt.views import TokenObtainPairView
from .authentication import CustomTokenObtainPairSerializer

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
from django.shortcuts import get_object_or_404
from .permissions import IsAdminUserCustom

class FreezeUserView(APIView):
    permission_classes = [IsAdminUserCustom]

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user.is_frozen = True
        user.save()
        return Response({
            "message": f"{user.username} has been frozen."
        })

class UnfreezeUserView(APIView):
    permission_classes = [IsAdminUserCustom]

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user.is_frozen = False
        user.save()
        return Response({
            "message": f"{user.username} has been unfrozen."
        })
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from .models import User
from .serializers import UserListSerializer


class UserListView(ListAPIView):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserListSerializer
    permission_classes = [IsAdminUser]

