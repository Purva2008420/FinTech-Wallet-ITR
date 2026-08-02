from django.urls import path
from .views import FraudAlertListView

urlpatterns = [
    path("", FraudAlertListView.as_view()),
]