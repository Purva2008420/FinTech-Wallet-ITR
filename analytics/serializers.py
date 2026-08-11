from rest_framework import serializers


class AnalyticsSerializer(serializers.Serializer):
    total_transactions = serializers.IntegerField()
    total_deposit = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_withdraw = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_transfer = serializers.DecimalField(max_digits=12, decimal_places=2)
    successful_transactions = serializers.IntegerField()
    failed_transactions = serializers.IntegerField()
    fraud_alerts = serializers.IntegerField()