from django.urls import path
from .views import DayListCreateAPIView, AnalyzeTasksAPIView

urlpatterns = [
    path('days/', DayListCreateAPIView.as_view(), name='day-list-create'),
    path('analyze/', AnalyzeTasksAPIView.as_view(), name='analyze-tasks'),
]