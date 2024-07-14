from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_TYPE = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE)

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_id = models.CharField(max_length=20, null=True)
    department = models.CharField(max_length=50, null=True)
    courses_taught = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.user.username

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    student_id = models.CharField(max_length=20, unique=True, null=True)
    grade = models.CharField(max_length=10, null=True)
    major = models.CharField(max_length=50, null=True)  # 修正此处
    teacher = models.ForeignKey('Teacher', related_name='students', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.user.username
