from django.urls import path
from . import views

urlpatterns = [
    path('Gen', views.ImageWordView.as_view(), name='audio_text'),
    # 其他路径配置...
]