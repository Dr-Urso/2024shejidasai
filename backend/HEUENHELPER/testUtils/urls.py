from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('ping/', views.PingView.as_view()),
path('csrf/', views.get_csrf_token),
]
