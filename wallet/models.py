from django.db import models
from django.conf import settings
import uuid

class Wallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallet"
    )
    wallet_number = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )
    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.wallet_number:
            # Generates a unique 16-digit hex string
            self.wallet_number = str(uuid.uuid4()).replace("-", "")[:16]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - ₹{self.balance}"