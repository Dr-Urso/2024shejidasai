from django.urls import path
from . import views
urlpatterns = [
    path('mark', views.SaveInfoView.as_view()),
    path('exam', views.SaveExamInfoView.as_view()),
    path('summary', views.ExamSummaryView.as_view()),
]