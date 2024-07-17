from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('gen', views.GenerateLessonPlanView.as_view()),

]