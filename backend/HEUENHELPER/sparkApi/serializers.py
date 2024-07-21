from rest_framework import serializers
from .models import Diary, ExamInfo

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = '__all__'

class ExamInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamInfo
        fields = '__all__'
