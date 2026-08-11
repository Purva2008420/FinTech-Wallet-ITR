from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ProfileSerializer,
    ChangePasswordSerializer,
)


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]
    def get(self, request):
        print(request.user)
        print(type(request.user))
        serializer = ProfileSerializer(request.user)

        return Response(serializer.data)

    def put(self, request):
        print(request.data)

        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        print(serializer.errors)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(
            serializer.validated_data["old_password"]
        ):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(
            serializer.validated_data["new_password"]
        )

        request.user.save()

        return Response(
            {"message": "Password changed successfully."}
        )
