from django.contrib import admin
from django.urls import path
from . import views
from .views import GetAIAdviceView

urlpatterns = [
    path('ping/', views.PingView.as_view()),
path('csrf/', views.get_csrf_token),
path('get-ai-advice/', GetAIAdviceView.as_view(), name='get_ai_advice'),
]
