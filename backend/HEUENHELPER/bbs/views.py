from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Question, FollowUp
from .serializers import QuestionSerializer, FollowUpSerializer

class QuestionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        if request.user.user_type != 'student':
            return Response({'detail': '只有学生可以提出问题'}, status=status.HTTP_403_FORBIDDEN)

        text = request.data.get('text')
        if not text:
            return Response({'detail': '问题内容不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        question = Question.objects.create(student=request.user, text=text)
        serializer = QuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QuestionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response({'detail': '问题不存在'}, status=status.HTTP_404_NOT_FOUND)

        serializer = QuestionSerializer(question)
        return Response(serializer.data)

class FollowUpView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response({'detail': '问题不存在'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.user_type not in ['teacher', 'student']:
            return Response({'detail': '无效的用户类型'}, status=status.HTTP_403_FORBIDDEN)

        text = request.data.get('text')
        if not text:
            return Response({'detail': '内容不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        is_teacher_response = request.user.user_type == 'teacher'
        follow_up = FollowUp.objects.create(question=question, user=request.user, text=text, is_teacher_response=is_teacher_response)
        serializer = FollowUpSerializer(follow_up)
        return Response(serializer.data, status=status.HTTP_201_CREATED)