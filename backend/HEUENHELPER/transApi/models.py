from django.db import models

from backend.HEUENHELPER.userLogin.models import User


# Create your models here.
class Translation(models.Model):
    user = models.ManyToManyField(User, on_delete=models.CASCADE, primary_key=True)
    fromText=models.TextField(max_length=8000)
    toText=models.TextField(max_length=8000)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username