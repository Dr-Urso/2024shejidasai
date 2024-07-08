from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import Request, Conversation, Message
from .serializers import RequestSerializer, ConversationSerializer, MessageSerializer

User = get_user_model()

class SendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        sender = request.user
        receiver_name = request.data.get('receiver')
        try:
            receiver = User.objects.get(username=receiver_name)
        except User.DoesNotExist:
            return Response({'detail': '接收者不存在'}, status=status.HTTP_404_NOT_FOUND)

        if sender == receiver:
            return Response({'detail': '不能给自己发送请求'}, status=status.HTTP_400_BAD_REQUEST)

        if Request.objects.filter(sender=sender, receiver=receiver, status='pending').exists():
            return Response({'detail': '已经有一个待处理的请求'}, status=status.HTTP_400_BAD_REQUEST)

        request_obj = Request.objects.create(sender=sender, receiver=receiver)
        serializer = RequestSerializer(request_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RespondRequestView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, request_id):
        try:
            request_obj = Request.objects.get(id=request_id)
        except Request.DoesNotExist:
            return Response({'detail': '请求不存在'}, status=status.HTTP_404_NOT_FOUND)

        if request.user != request_obj.receiver:
            return Response({'detail': '未授权操作'}, status=status.HTTP_403_FORBIDDEN)

        status_update = request.data.get('status')
        if status_update not in ['accepted', 'rejected']:
            return Response({'detail': '无效的状态'}, status=status.HTTP_400_BAD_REQUEST)

        request_obj.status = status_update
        request_obj.save()

        serializer = RequestSerializer(request_obj)
        return Response(serializer.data)

class RequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sent_requests = Request.objects.filter(sender=user)
        received_requests = Request.objects.filter(receiver=user)
        sent_serializer = RequestSerializer(sent_requests, many=True)
        received_serializer = RequestSerializer(received_requests, many=True)
        return Response({
            'sent_requests': sent_serializer.data,
            'received_requests': received_serializer.data
        })

class ConversationView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user
        other_user = request.data.get('other_user')
        topic = request.data.get('topic')

        try:
            print(other_user)
            other_user = User.objects.get(username=other_user)
        except User.DoesNotExist:
            return Response({'detail': '对方用户不存在'}, status=status.HTTP_404_NOT_FOUND)

        if user.user_type == 'teacher':
            if other_user.user_type != 'student':
                return Response({'detail': '对方用户不是学生'}, status=status.HTTP_400_BAD_REQUEST)
            conversation = Conversation.objects.create(teacher=user, student=other_user, topic=topic)
        elif user.user_type == 'student':
            if other_user.user_type != 'teacher':
                return Response({'detail': '对方用户不是老师'}, status=status.HTTP_400_BAD_REQUEST)
            conversation = Conversation.objects.create(teacher=other_user, student=user, topic=topic)
        else:
            return Response({'detail': '无效的用户类型'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        user = request.user
        if user.user_type == 'teacher':
            conversations = Conversation.objects.filter(teacher=user)
        else:
            conversations = Conversation.objects.filter(student=user)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)

class MessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'detail': '对话不存在'}, status=status.HTTP_404_NOT_FOUND)

        if request.user not in [conversation.teacher, conversation.student]:
            return Response({'detail': '未授权操作'}, status=status.HTTP_403_FORBIDDEN)

        messages = Message.objects.filter(conversation=conversation)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'detail': '对话不存在'}, status=status.HTTP_404_NOT_FOUND)

        if request.user not in [conversation.teacher, conversation.student]:
            return Response({'detail': '未授权操作'}, status=status.HTTP_403_FORBIDDEN)

        text = request.data.get('text')
        if not text:
            return Response({'detail': '消息内容不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(conversation=conversation, sender=request.user, text=text)
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)