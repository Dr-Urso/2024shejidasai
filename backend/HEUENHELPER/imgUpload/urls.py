from django.urls import path
from . import views

urlpatterns = [
    path('upload', views.ImageUploadView.as_view(), name='upload_image'),
    # 其他路径配置...
]