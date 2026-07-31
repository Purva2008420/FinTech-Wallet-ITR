from django.urls import path
from .views import WalletDetailView, AddMoneyView, TransferMoneyView

urlpatterns = [
    path("", WalletDetailView.as_view(), name="wallet-detail"),
    path("add-money/", AddMoneyView.as_view(), name="add-money"),
    path("transfer/", TransferMoneyView.as_view()),
]