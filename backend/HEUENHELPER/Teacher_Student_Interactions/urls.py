from django.urls import path
from .views import SendRequestView, RespondRequestView, ConversationView, MessageView, RequestListView

urlpatterns = [
    path('send-request/', SendRequestView.as_view(), name='send-request'),
    path('respond-request/<int:request_id>/', RespondRequestView.as_view(), name='respond-request'),
    path('requests/', RequestListView.as_view(), name='requests'),  # 新增的获取请求信息的接口
    path('conversations/', ConversationView.as_view(), name='conversations'),
    path('conversations/<int:conversation_id>/messages/', MessageView.as_view(), name='messages'),
]