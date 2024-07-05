from django.urls import path
from . import views



urlpatterns = [
    path('create', views.CreateUserView.as_view()),
    path('login', views.LoginUserView.as_view()),
    path('logout', views.LogoutUserView.as_view()),
    path('status', views.ShowLoginStatus.as_view()),
]
