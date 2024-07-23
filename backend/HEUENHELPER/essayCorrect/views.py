from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.conf import settings
import requests
import json

from services.AI_API_CALL import RateLimitException, AIAdviceService, InvalidRoleException


class EssayCorrectionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.user.id
            essay_text = request.data.get('essay_text')
            if not essay_text:
                return Response({"error": "作文文本不能为空"}, status=status.HTTP_400_BAD_REQUEST)

            ai_service = AIAdviceService()
            ai_service.add_param('system','你是一位很擅长修改学生作文的老师，你现在的任务是给学生的作文提出修改建议，指出作文中的错误。用中文给出修改建议。').add_param('user', '下面是学生作文：'  +  essay_text)
            advice = ai_service.get_advice(user_id=user_id)

            return Response(advice, status=status.HTTP_200_OK)

        except RateLimitException as e:
            return Response({"error": str(e)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        except InvalidRoleException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"error": "包含敏感内容,错误码10013"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)