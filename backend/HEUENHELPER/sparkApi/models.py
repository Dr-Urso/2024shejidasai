from django.db import models
from userLogin.models import User
from userLogin.models import Student


# Create your models here.
class BaseInfo(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    fullMark = models.CharField(max_length=100)

    def __str__(self):
        return self.student.name



class ExamInfo(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    examType = models.CharField(max_length=100)
    examName = models.CharField(max_length=100)
    examScore = models.TextField(max_length=8000)
    selfEvaluation=models.TextField(max_length=8000)

    def __str__(self):
        return self.examName

class ExamSummary(models.Model):
    uesr= models.ManyToManyField(User, on_delete=models.CASCADE)
    examData=models.TextField(max_length=8000)
    examSummary=models.TextField(max_length=8000)

    def __str__(self):
        return ", ".join([user.username for user in self.user.all()])
