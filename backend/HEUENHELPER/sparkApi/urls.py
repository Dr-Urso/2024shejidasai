from django.urls import path
from . import views

urlpatterns = [
    path('mark', views.SaveInfoView.as_view()),
    path('exam', views.SaveExamInfoView.as_view()),
    path('summary', views.ExamSummaryView.as_view()),
    path('baseInfo', views.GetBaseInfoView.as_view()),
    path('scores', views.UserExamScoresAPIView.as_view()),
    path('diary_summary', views.DiarySummaryView.as_view()),
    path('todo_summary', views.ToDoListSummaryView.as_view()),
    path('writing_correction', views.WritingCorrectView.as_view()),
    path('teaching_plan', views.TeachingPlanView.as_view()),
    path('diary_list', views.DiaryListView.as_view()),
    path('upload', views.DocumentUploadView.as_view()),
    path('qanda', views.DocumentQAndAView.as_view()),
    path('document_summary', views.DocumentSummaryView.as_view()),
    path('document_summary_result', views.DocumentSummaryView.as_view())

]
