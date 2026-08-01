from django.urls import path
from .views import (
    TransactionHistoryView,
    TransactionDetailView,
)

urlpatterns = [
    path("", TransactionHistoryView.as_view()),
    path("<int:pk>/", TransactionDetailView.as_view()),
]