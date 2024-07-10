import json
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .webApi.WebITS import get_result


class translationView(APIView):

    def post(self, request):
        sender = request.user
        text = request.data['text']
        host = "itrans.xfyun.cn"
        gClass = get_result(host)

        # 设置要翻译的文本
        gClass.setText(text)

        # 设置翻译的语言对
        gClass.setBusinessArgs({
            "from": "en",
            "to": "cn"
        })

        res = gClass.call_url()
        data = res['data']['result']['trans_result']['dst']
        return Response({'result': data})
