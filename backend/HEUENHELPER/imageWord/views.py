from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from .api.word2picture import imgaeWord


class ImageWordView(APIView):

    def post(self, request):
        if request.method == "POST":
            text = request.data['text']
            data = f"'''生成一张图：{text}'''"

            imgaeWord(data)

            return Response({'message': '图片生成成功'}, status=200)
        else:
            return Response({'error': '图片生成成功'}, status=400)
