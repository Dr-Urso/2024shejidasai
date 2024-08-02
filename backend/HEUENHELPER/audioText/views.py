from django.shortcuts import render

# Create your views here.
import base64
from rest_framework.response import Response
from rest_framework.views import APIView

from .api.text_speech_synthesis import audioGen
class AudioTextView(APIView):

    def post(self, request):
        if request.method == "POST":
            text=request.data['text']
            lang = request.data['lang']
            lang = lang.replace('cn', 'zh')

            audio=text

            audioGen(audio,lang)

            return Response({'message': '成长文本语音合成功'}, status=200)
        else:
            return Response({'error': '成长文本语音合成功'}, status=400)
