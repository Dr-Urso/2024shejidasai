from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.

from rest_framework.views import APIView
from django.middleware.csrf import get_token

class PingView(APIView):
    def get(self, request):
        return Response({"ping": "pong"})

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})