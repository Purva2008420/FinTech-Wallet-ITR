from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from fraud_detection.models import FraudAlert
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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.contrib.auth import update_session_auth_hash


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "phone": request.user.phone,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "is_staff": request.user.is_staff,
        })

    def put(self, request):
        user = request.user

        user.first_name = request.data.get(
            "first_name",
            user.first_name
        )

        user.last_name = request.data.get(
            "last_name",
            user.last_name
        )

        user.email = request.data.get(
            "email",
            user.email
        )

        user.save()

        return Response({
            "message": "Profile updated successfully.",
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
        })
User = get_user_model()
from django.contrib.auth import update_session_auth_hash


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response(
                {
                    "error": "Old password and new password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {
                    "error": "Current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {
                    "error": "New password must be at least 8 characters."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        update_session_auth_hash(request, user)

        return Response({
            "message": "Password changed successfully."
        })
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUserCustom]

    def get(self, request):

        # ==========================
        # User Statistics
        # ==========================

        total_users = User.objects.count()

        active_users = User.objects.filter(
            is_active=True,
            is_frozen=False
        ).count()

        frozen_users = User.objects.filter(
            is_frozen=True
        ).count()

        admin_users = User.objects.filter(
            is_staff=True
        ).count()


        # ==========================
        # Wallet Statistics
        # ==========================

        total_wallets = Wallet.objects.count()

        total_balance = Wallet.objects.aggregate(
            total=Sum("balance")
        )["total"] or 0


        # ==========================
        # Transaction Statistics
        # ==========================

        total_transactions = Transaction.objects.count()


        # ==========================
        # Fraud Statistics
        # ==========================

        total_alerts = FraudAlert.objects.count()

        resolved_alerts = FraudAlert.objects.filter(
            is_resolved=True
        ).count()

        pending_alerts = FraudAlert.objects.filter(
            is_resolved=False
        ).count()


        # ==========================
        # Latest Transactions
        # ==========================

        latest_transactions = Transaction.objects.order_by(
            "-created_at"
        )[:5]

        serializer = TransactionSerializer(
            latest_transactions,
            many=True
        )


        # ==========================
        # Dashboard Response
        # ==========================

        return Response({

            # Users
            "total_users": total_users,
            "active_users": active_users,
            "frozen_users": frozen_users,
            "admin_users": admin_users,

            # Wallet
            "total_wallets": total_wallets,
            "total_balance": total_balance,

            # Transactions
            "total_transactions": total_transactions,

            # Fraud
            "total_fraud_alerts": total_alerts,
            "resolved_alerts": resolved_alerts,
            "pending_alerts": pending_alerts,

            # Latest transactions
            "latest_transactions": serializer.data,
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
from .permissions import IsAdminUserCustom
from .models import User
from .serializers import UserListSerializer


class UserListView(ListAPIView):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserListSerializer
    permission_classes = [IsAdminUserCustom]


