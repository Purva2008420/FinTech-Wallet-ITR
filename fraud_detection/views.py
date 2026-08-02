from rest_framework.generics import ListAPIView
from .models import FraudAlert
from .serializers import FraudAlertSerializer
from accounts.permissions import IsAdminUserCustom

class FraudAlertListView(ListAPIView):

    serializer_class = FraudAlertSerializer
    permission_classes = [IsAdminUserCustom]

    queryset = FraudAlert.objects.order_by("-created_at")
