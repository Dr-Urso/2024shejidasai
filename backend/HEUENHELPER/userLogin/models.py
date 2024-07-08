from uuid import uuid1

from django.contrib.auth.models import AbstractUser, Permission, Group
from django.contrib.sessions.models import Session
from django.db import models
from django.utils import timezone
import base64


# Create your models here.
# 用户类
class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    username = models.CharField(max_length=16, unique=True)
    nickname = models.CharField(max_length=16, unique=True, null=True)
    mobile_num = models.CharField(max_length=20, unique=True, null=True)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    USER_TYPE = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE)

    def save(self, *args, **kwargs):
        if self.pk is None:  # 新建对象时
            super().save(*args, **kwargs)  # 先保存 User 对象以获取主键
            if self.user_type == 'student':
                Student.objects.create(user=self)
            elif self.user_type == 'teacher':
                Teacher.objects.create(user=self)
        else:
            super().save(*args, **kwargs)


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    student_id = models.CharField(max_length=20, unique=True, null=True)
    grade = models.CharField(max_length=10, null=True)
    major = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.user.username


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_id = models.CharField(max_length=20, null=True)
    department = models.CharField(max_length=50, null=True)
    courses_taught = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.user.username
