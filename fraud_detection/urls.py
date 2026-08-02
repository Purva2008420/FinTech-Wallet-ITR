from django.urls import path

from .views import (
    FraudAlertListView,
    FraudAlertDetailView,
    ResolveFraudAlertView
)

urlpatterns = [
    path("", FraudAlertListView.as_view()),
    path("<int:pk>/", FraudAlertDetailView.as_view()),
    path("<int:pk>/resolve/", ResolveFraudAlertView.as_view()),
]