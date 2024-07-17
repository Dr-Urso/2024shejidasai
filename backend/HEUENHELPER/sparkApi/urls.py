from django.urls import path
from . import views

urlpatterns = [
    path('mark', views.SaveInfoView.as_view()),
    path('exam', views.SaveExamInfoView.as_view()),
    path('summary', views.ExamSummaryView.as_view()),
    path('diary_summary', views.DraiySummaryView.as_view()),
    path('todo_summary', views.ToDoListSummaryView.as_view()),
    path('writing_correction', views.WritingCorrectView.as_view()),
    path('teaching_plan', views.TeachingPlanView.as_view()),
]
