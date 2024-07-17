from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('correction', views.EssayCorrectionView.as_view()),

]