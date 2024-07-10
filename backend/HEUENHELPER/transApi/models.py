from django.db import models
from userLogin.models import User

class Translation(models.Model):
    user = models.ManyToManyField(User)
    fromText = models.TextField(max_length=8000)
    toText = models.TextField(max_length=8000)
    status = models.BooleanField(default=True)

    def __str__(self):
        return ", ".join([user.username for user in self.user.all()])
