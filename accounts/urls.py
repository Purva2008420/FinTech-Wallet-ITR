from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    ProfileView,
    AdminDashboardView,
    CustomLoginView,
    FreezeUserView,
    UnfreezeUserView
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomLoginView.as_view(), name="login_custom"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin_dashboard"),

    path("freeze/<int:user_id>/", FreezeUserView.as_view(), name="freeze_user"),
    path("unfreeze/<int:user_id>/", UnfreezeUserView.as_view(), name="unfreeze_user"),
]
