import base64

from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from .api.universal_character_recognition import recognition
from .api.ocr_mix_instig import universalOcr


class ImageUploadView(APIView):

    def post(self, request):
        global res
        if request.method == "POST":
            image_files = request.FILES.getlist('images')
            lang = request.data['lang']
            instig = universalOcr()
            res_list = []
            for image_file in image_files:
                #读取文件内容
                image_bytes = image_file.read()

                # 将文件内容进行Base64编码
                image_base64 = base64.b64encode(image_bytes).decode('utf-8')

                if lang == 'en':
                    res = instig.recognition_instig(image_base64)
                elif lang == 'cn':
                    res = recognition(image_base64)

                res_list.append(res)
            result = ''.join(res_list)
            return Response({'message': '图片文本识别成功', 'result': result}, status=200)
        else:
            return Response({'error': '图片文本识别失败'}, status=400)
