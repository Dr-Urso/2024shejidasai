from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from .webApi.test_json import score_json, subject_json, data_json
from models import ExamSummary, ExamInfo, BaseInfo
from .webApi.sparkAPI import main,res

# Create your views here.
class SaveInfoView(APIView):

    def post(self, request):
        if request.method == "POST":
            Info=BaseInfo(
                subject=request.data['subject'],
                fullMark=request.data['fullMark']
            )
            Info.save()

class SaveExamInfoView(APIView):

    def post(self, request):
        if request.method == "POST":
            examInfo = ExamInfo(
                examName=request.POST['examName'],
                examType=request.POST['examType'],
                examScore=request.POST['examScore'],
                selfEvaluation=request.POST['selfEvaluation'],
            )
            examInfo.save()

class examSummaryView(APIView):

    def post(self, request):
        examSummary = ExamSummary()

        query = "评分标准：" + score_json + "\n考试科目名称：" + subject_json + "\n学生要分析的考试信息：" + data_json
        main(query)

        return Response({'result': res})

