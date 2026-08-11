from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        return super().get_token(user)

    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.is_frozen:
            raise serializers.ValidationError(
                "Your account has been frozen. Please contact the administrator."
            )

        return data