from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('ping/', views.PingView.as_view()),
]
