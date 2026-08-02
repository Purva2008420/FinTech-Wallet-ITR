from decimal import Decimal
from datetime import timedelta

from django.utils import timezone

from .models import FraudAlert
from transactions.models import Transaction

HIGH_AMOUNT = Decimal("50000.00")
MAX_TRANSFERS = 5
TIME_WINDOW = timedelta(minutes=1)


def detect_fraud(transaction):

    alerts = []

    # Rule 1: High amount transaction
    if transaction.amount >= HIGH_AMOUNT:
        alerts.append(
            (
                "High value transaction",
                "HIGH"
            )
        )

    # Rule 2: Too many transfers
    recent = Transaction.objects.filter(
        user=transaction.user,
        transaction_type="TRANSFER",
        created_at__gte=timezone.now() - TIME_WINDOW
    ).count()

    if recent >= MAX_TRANSFERS:
        alerts.append(
            (
                "Multiple transfers within one minute",
                "MEDIUM"
            )
        )

    for reason, severity in alerts:
        FraudAlert.objects.create(
            transaction=transaction,
            user=transaction.user,
            reason=reason,
            severity=severity
        )