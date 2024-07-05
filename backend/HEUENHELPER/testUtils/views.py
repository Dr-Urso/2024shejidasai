from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.

from rest_framework.views import APIView


class PingView(APIView):
    def get(self, request):
        return Response({"ping": "pong"})
