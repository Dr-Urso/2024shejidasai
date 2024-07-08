
from rest_framework import serializers
from .models import Request, Conversation, Message

class RequestSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    receiver_username = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = ['id', 'sender', 'sender_username', 'receiver', 'receiver_username', 'status', 'created_at']

    def get_sender_username(self, obj):
        return obj.sender.username

    def get_receiver_username(self, obj):
        return obj.receiver.username

class ConversationSerializer(serializers.ModelSerializer):
    teacher_username = serializers.SerializerMethodField()
    student_username = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'teacher', 'teacher_username', 'student', 'student_username', 'topic', 'created_at']

    def get_teacher_username(self, obj):
        return obj.teacher.username

    def get_student_username(self, obj):
        return obj.student.username

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_username', 'text', 'created_at']

    def get_sender_username(self, obj):
        return obj.sender.username