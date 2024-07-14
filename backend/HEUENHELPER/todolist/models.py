from django.conf import settings
from django.db import models

# Create your models here.


class Day(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.date}"

class Task(models.Model):
    day = models.ForeignKey(Day, related_name='tasks', on_delete=models.CASCADE)
    task_name = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=[
        ('未开始', '未开始'),
        ('进行中', '进行中'),
        ('已完成', '已完成'),
    ])

    def __str__(self):
        return self.task_name