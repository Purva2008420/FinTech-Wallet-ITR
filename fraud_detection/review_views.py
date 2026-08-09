from django.db import transaction as db_transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from transactions.models import Transaction
from .models import FraudAlert


class PendingTransactionsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        pending_transactions = Transaction.objects.filter(
            status="PENDING"
        ).order_by("-created_at")

        data = []

        for txn in pending_transactions:
            alerts = FraudAlert.objects.filter(
                transaction=txn,
                is_resolved=False
            )

            data.append({
                "id": txn.id,
                "amount": str(txn.amount),
                "status": txn.status,
                "transaction_type": txn.transaction_type,
                "description": txn.description,
                "created_at": txn.created_at,
                "sender": txn.sender.username if txn.sender else None,
                "receiver": txn.receiver.username if txn.receiver else None,
                "fraud_alerts": [
                    {
                        "id": alert.id,
                        "reason": alert.reason,
                        "severity": alert.severity,
                        "is_resolved": alert.is_resolved,
                    }
                    for alert in alerts
                ]
            })

        return Response({
            "count": len(data),
            "pending_transactions": data
        })

class PendingTransactionReviewView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request, transaction_id, action):
        try:
            pending_transaction = Transaction.objects.get(
                id=transaction_id,
                status="PENDING"
            )
        except Transaction.DoesNotExist:
            return Response(
                {
                    "error": "Pending transaction not found."
                },
                status=404
            )

        if action not in ["approve", "reject"]:
            return Response(
                {
                    "error": "Invalid action."
                },
                status=400
            )

        # REJECT
        if action == "reject":
            pending_transaction.status = "FAILED"
            pending_transaction.description = (
                "Transaction rejected during security review."
            )
            pending_transaction.save()

            FraudAlert.objects.filter(
                transaction=pending_transaction,
                is_resolved=False
            ).update(is_resolved=True)

            return Response({
                "message": "Pending transaction rejected.",
                "status": "FAILED",
                "transaction_id": pending_transaction.id
            })

        # APPROVE
        with db_transaction.atomic():
            sender = pending_transaction.sender

            if sender is None:
                return Response(
                    {
                        "error": "Original sender not found."
                    },
                    status=400
                )

            sender_wallet = sender.wallet

            receiver = pending_transaction.receiver

            if receiver is None:
                return Response(
                    {
                        "error": "Receiver not found."
                    },
                    status=400
                )

            receiver_wallet = receiver.wallet

            # Check balance again before approval
            if sender_wallet.balance < pending_transaction.amount:
                pending_transaction.status = "FAILED"
                pending_transaction.description = (
                    "Transaction failed during review: "
                    "Insufficient balance."
                )
                pending_transaction.save()

                FraudAlert.objects.filter(
                    transaction=pending_transaction,
                    is_resolved=False
                ).update(is_resolved=True)

                return Response({
                    "message": "Transaction failed due to insufficient balance.",
                    "status": "FAILED",
                    "transaction_id": pending_transaction.id
                })

            # Transfer money
            sender_wallet.balance -= pending_transaction.amount
            receiver_wallet.balance += pending_transaction.amount

            sender_wallet.save()
            receiver_wallet.save()

            # Update original pending transaction
            pending_transaction.status = "SUCCESS"
            pending_transaction.description = (
                f"Pending transaction approved. "
                f"Transferred to {receiver.username}"
            )
            pending_transaction.save()

            # Resolve fraud alerts
            FraudAlert.objects.filter(
                transaction=pending_transaction,
                is_resolved=False
            ).update(is_resolved=True)

            Transaction.objects.create(
                user=receiver,
                sender=sender,
                receiver=receiver,
                transaction_type="TRANSFER",
                amount=pending_transaction.amount,
                status="SUCCESS",
                description=(
                    f"Received from {sender.username} "
                    "after security review"
                )
            )

        return Response({
            "message": "Pending transaction approved successfully.",
            "status": "SUCCESS",
            "transaction_id": pending_transaction.id,
            "balance": sender_wallet.balance
        })