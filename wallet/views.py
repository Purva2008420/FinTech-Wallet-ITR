from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import WalletSerializer

class WalletDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = WalletSerializer(request.user.wallet)
        return Response(serializer.data)