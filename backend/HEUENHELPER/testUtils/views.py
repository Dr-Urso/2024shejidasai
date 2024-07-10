from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from services.AI_API_CALL import AIAdviceService, RateLimitException, InvalidRoleException

# Create your views here.

from rest_framework.views import APIView
from django.middleware.csrf import get_token

class PingView(APIView):
    def get(self, request):
        return Response({"ping": "pong"})

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})





class GetAIAdviceView(APIView):
    def post(self, request):
        ai_service = AIAdviceService()

        student_id = request.data.get('student_id')
        subject = request.data.get('subject')

        if not student_id or not subject:
            return Response({'detail': 'Missing required parameters'}, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.user.id

        try:
            advice = (ai_service
                      .add_param('user', f'学生ID: {student_id}')
                      .add_param('user', f'科目: {subject}')
                      .get_advice(user_id))
            return Response(advice, status=status.HTTP_200_OK)
        except InvalidRoleException as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RateLimitException as e:
            return Response({'detail': str(e)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        except request.RequestException as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)