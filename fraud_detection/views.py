from rest_framework.generics import ListAPIView

from accounts.permissions import IsAdminUserCustom
from fraud_detection.models import FraudAlert
from fraud_detection.serializers import FraudAlertSerializer


class FraudAlertListView(ListAPIView):

    serializer_class = FraudAlertSerializer
    permission_classes = [IsAdminUserCustom]

    def get_queryset(self):

        queryset = FraudAlert.objects.order_by("-created_at")

        severity = self.request.query_params.get("severity")
        resolved = self.request.query_params.get("resolved")

        if severity:
            queryset = queryset.filter(
                severity=severity.upper()
            )

        if resolved is not None:
            queryset = queryset.filter(
                is_resolved=resolved.lower() == "true"
            )

        return queryset

from rest_framework.generics import RetrieveAPIView

class FraudAlertDetailView(RetrieveAPIView):

    serializer_class = FraudAlertSerializer
    permission_classes = [IsAdminUserCustom]

    queryset = FraudAlert.objects.all()
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class ResolveFraudAlertView(APIView):

    permission_classes = [IsAdminUserCustom]

    def post(self, request, pk):

        alert = get_object_or_404(
            FraudAlert,
            pk=pk
        )

        alert.is_resolved = True
        alert.save()

        return Response({
            "message": "Fraud alert marked as resolved."
        })