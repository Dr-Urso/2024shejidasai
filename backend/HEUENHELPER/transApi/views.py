import json

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.HEUENHELPER.transApi.webApi.WebITS import get_result


# Create your views here.
class translationView(APIView):

    def post(self, request):
        sender = request.user
        text= request.data['text']
        host = "itrans.xfyun.cn"
        gClass=get_result(host)
        gClass.setText(text)
        gClass.setText({
            "from": "en",
            "to": "cn"})
        res=gClass.call_url()
        data=res['data']['result']['trans_result']['dst']
        return  Response({'result':data})

