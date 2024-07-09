from rest_framework import serializers
from .models import Question, FollowUp


class FollowUpSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = FollowUp
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    follow_ups = FollowUpSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = '__all__'