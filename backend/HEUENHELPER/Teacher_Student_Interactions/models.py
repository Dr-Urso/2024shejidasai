from django.db import models

# Create your models here.

from django.db import models
from django.conf import settings

class Request(models.Model):
    REQUEST_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=REQUEST_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Conversation(models.Model):
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='teacher_conversations', on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='student_conversations', on_delete=models.CASCADE)
    topic = models.CharField(max_length=255)  # 新增主题字段
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

