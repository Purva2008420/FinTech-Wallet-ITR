from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionHistoryView(ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Base filter: Only fetch records belonging to the logged-in user
        queryset = Transaction.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

        # Step 8 Filter: Search by transaction type (?type=deposit or ?type=transfer)
        transaction_type = self.request.query_params.get("type")
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type.upper())

        # Step 9 Filter: Filter by status code (?status=success)
        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(status=status.upper())

        return queryset

class TransactionDetailView(RetrieveAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Strict isolation: Users can only pull details of their own records
        return Transaction.objects.filter(user=self.request.user)

