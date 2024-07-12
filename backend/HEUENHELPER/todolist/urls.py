from django.urls import path
from .views import DayListCreateAPIView, AnalyzeTasksAPIView, TaskUpdateAPIView

urlpatterns = [
    path('days/', DayListCreateAPIView.as_view(), name='day-list-create'),
    path('analyze/', AnalyzeTasksAPIView.as_view(), name='analyze-tasks'),
    path('tasks/<int:task_id>/', TaskUpdateAPIView.as_view(), name='task-update'),
]