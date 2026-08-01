from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.username", read_only=True)
    receiver = serializers.CharField(source="receiver.username", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "transaction_type",
            "sender",
            "receiver",
            "amount",
            "status",
            "description",
            "created_at",
        ]