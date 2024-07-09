from django.urls import path
from .views import QuestionListView, QuestionDetailView, FollowUpView

urlpatterns = [
    path('questions/', QuestionListView.as_view(), name='question_list'),
    path('questions/<int:question_id>/', QuestionDetailView.as_view(), name='question_detail'),
    path('questions/<int:question_id>/followups/', FollowUpView.as_view(), name='follow_up'),
]