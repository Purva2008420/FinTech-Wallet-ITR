from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from transactions.models import Transaction
from fraud_detection.models import FraudAlert


class AnalyticsDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        total_transactions = Transaction.objects.count()

        total_deposit = (
            Transaction.objects.filter(
                transaction_type="DEPOSIT",
                status="SUCCESS"
            ).aggregate(total=Sum("amount"))["total"] or 0
        )

        total_withdraw = (
            Transaction.objects.filter(
                transaction_type="WITHDRAW",
                status="SUCCESS"
            ).aggregate(total=Sum("amount"))["total"] or 0
        )

        total_transfer = (
            Transaction.objects.filter(
                transaction_type="TRANSFER",
                status="SUCCESS"
            ).aggregate(total=Sum("amount"))["total"] or 0
        )

        successful_transactions = Transaction.objects.filter(
            status="SUCCESS"
        ).count()

        failed_transactions = Transaction.objects.filter(
            status="FAILED"
        ).count()

        fraud_alerts = FraudAlert.objects.count()

        data = {
            "total_transactions": total_transactions,
            "total_deposit": total_deposit,
            "total_withdraw": total_withdraw,
            "total_transfer": total_transfer,
            "successful_transactions": successful_transactions,
            "failed_transactions": failed_transactions,
            "fraud_alerts": fraud_alerts,
        }

        return Response(data)