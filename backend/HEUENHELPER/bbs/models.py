from django.db import models
from django.conf import settings

class Question(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class FollowUp(models.Model):
    question = models.ForeignKey(Question, related_name='follow_ups', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_teacher_response = models.BooleanField(default=False)