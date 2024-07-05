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
    nickname = models.CharField(max_length=16, unique=True)
    mobile_num = models.CharField(max_length=20, unique=True)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
