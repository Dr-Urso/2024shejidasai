from django.contrib import admin
from .models import Question, FollowUp
# Register your models here.
admin.site.register(Question)
admin.site.register(FollowUp)