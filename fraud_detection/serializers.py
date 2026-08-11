from rest_framework import serializers
from .models import FraudAlert

class FraudAlertSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    amount = serializers.DecimalField(
        source="transaction.amount",
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = FraudAlert
        fields = [
            "id",
            "username",
            "amount",
            "reason",
            "severity",
            "is_resolved",
            "created_at"
        ]