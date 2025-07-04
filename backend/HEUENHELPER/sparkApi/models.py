from django.db import models
from userLogin.models import User, Student


class BaseInfo(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    education_level = models.CharField(max_length=50, null=True)  # 增加教育阶段字段
    subject = models.CharField(max_length=100, null=True)
    fullMark = models.JSONField(null=True)  # 使用JSON字段存储各科总分

    def __str__(self):
        return self.student.user.username


class ExamInfo(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    examType = models.CharField(max_length=100)
    examName = models.CharField(max_length=100)
    examScore = models.JSONField(null=True)  # 使用JSON字段存储各科成绩
    totalScore = models.JSONField(null=True)  # 使用JSON字段存储各科总分
    selfEvaluation = models.TextField(max_length=8000)

    def __str__(self):
        return self.examName


class ExamSummary(models.Model):
    user = models.ManyToManyField(User)
    examData = models.TextField(max_length=8000)
    examSummary = models.TextField(max_length=8000)

    def __str__(self):
        return ", ".join([user.username for user in self.user.all()])


class Diary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=255)
    date = models.DateField()
    mood = models.CharField(max_length=50, default='平常心')
    content = models.TextField()

    def __str__(self):
        return self.title

class Document(models.Model):
    file = models.FileField(upload_to='documents/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, default='wiki')
    file_id = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    summary = models.TextField(null=True, blank=True)  # 添加 summary 字段

    def __str__(self):
        return self.file_name



class Question(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField(null=True, blank=True)
    asked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question