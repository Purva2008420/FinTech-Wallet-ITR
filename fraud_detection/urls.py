from django.urls import path
from .review_views import PendingTransactionsView, PendingTransactionReviewView
from .views import (
    FraudAlertListView,
    FraudAlertDetailView,
    ResolveFraudAlertView
)

urlpatterns = [
    path("", FraudAlertListView.as_view()),
    path("<int:pk>/", FraudAlertDetailView.as_view()),
    path("<int:pk>/resolve/", ResolveFraudAlertView.as_view()),
    path("pending/", PendingTransactionsView.as_view(), name="pending-transactions"),
path(
    "pending/<int:transaction_id>/<str:action>/",PendingTransactionReviewView.as_view(),name="pending-review"),
]