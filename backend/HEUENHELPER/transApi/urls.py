from django.urls import path
from . import views



urlpatterns = [
    path('trans', views.translationView.as_view()),
]