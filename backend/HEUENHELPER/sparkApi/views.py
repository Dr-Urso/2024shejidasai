import datetime

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import ExamSummary, ExamInfo, BaseInfo
from userLogin.models import Student, Teacher  # 引入 Student 和 Teacher 模型
from .webApi.sparkAPI import sparkApi, res
from .models import Diary
from .serializers import DiarySerializer
from userLogin.models import User, Student

class SaveInfoView(APIView):

    def post(self, request):
        try:
            print(request.data)
            student_id = request.data['student_id']
            subject = request.data['subject']
            fullMark = request.data['fullMark']
            education_level = request.data.get('education_level', '')

            # 验证 student_id 是否存在
            student = Student.objects.filter(student_id=student_id).first()
            if not student:
                return Response({'error': '无效的 student_id'}, status=status.HTTP_400_BAD_REQUEST)

            Info = BaseInfo(
                student=student,
                subject=subject,
                fullMark=fullMark,
                education_level=education_level
            )
            Info.save()
            return Response({'message': 'Base info saved successfully.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SaveExamInfoView(APIView):

    def post(self, request):
        try:
            print(request.data)
            student_id = request.data['student_id']
            examName = request.data['examName']
            examType = request.data['examType']
            examScore = request.data['examScore']
            totalScore = request.data['totalScore']
            selfEvaluation = request.data['selfEvaluation']

            # 验证 student_id 是否存在
            student = Student.objects.filter(student_id=student_id).first()
            if not student:
                return Response({'error': '无效的 student_id'}, status=status.HTTP_400_BAD_REQUEST)

            examInfo = ExamInfo(
                student=student,
                examName=examName,
                examType=examType,
                examScore=examScore,
                totalScore=totalScore,
                selfEvaluation=selfEvaluation,
            )
            examInfo.save()
            return Response({'message': 'Exam info saved successfully.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

import json
import logging
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import ExamSummary, ExamInfo, BaseInfo
from userLogin.models import Student, Teacher  # 引入 Student 和 Teacher 模型
from .webApi.sparkAPI import res

# 获取logger实例
logger = logging.getLogger(__name__)

class ExamSummaryView(APIView):
    def post(self, request):
        try:
            # 从请求数据中获取当前学生的 student_id
            student_id = request.user.id
            if not student_id:
                return Response({'error': '缺少学生ID'}, status=status.HTTP_400_BAD_REQUEST)

            # 从数据库中读取当前学生的考试信息
            exam_infos = ExamInfo.objects.filter(student_id=student_id)

            # 调试输出
            for exam in exam_infos:
                logger.debug(f"Exam: {exam.examName}, Score: {exam.examScore}")

            # 组织数据进行分析
            score_json_list = []
            subject_json_list = []
            data_json_list = []

            for exam in exam_infos:
                # 将 JSON 对象转换为字符串并添加到列表
                score_json_list.append(json.dumps(exam.examScore))
                subject_json_list.append(exam.examName)
                data_json_list.append(exam.selfEvaluation)

            # 用逗号分隔各部分数据
            score_json = ", ".join(score_json_list)
            subject_json = ", ".join(subject_json_list)
            data_json = ", ".join(data_json_list)

            # 构造查询
            query = f"评分标准：{score_json}\n考试科目名称：{subject_json}\n学生要分析的考试信息：{data_json}"
            logger.debug("Query: %s", query)

            # 调用分析函数
            res = sparkApi(query, 'exam')

            # 检查并返回分析结果
            if res is not None:
                logger.debug("Result: %s", res)
                return Response({'result': res}, status=status.HTTP_200_OK)
            else:
                logger.error("sparkApi returned null result")
                return Response({'result': None}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class ToDoListSummaryView(APIView):

    def post(self, request):
        try:

            #按照考试分析模板从数据库中获取json数据

            # 构造查询
            # query = f"评分标准：{score_json}\n考试科目名称：{subject_json}\n学生要分析的考试信息：{data_json}"
            query=''
            if request.user.user_type == 'teacher':
            # 调用分析函数
                sparkApi(query,'to_do_list_teacher')
            else:
                sparkApi(query,'to_do_list_student')

            # 打印分析结果
            logger.debug("Result: %s", res)

            return Response({'result': res}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#作文批改
class WritingCorrectView(APIView):

    def post(self, request):
        try:
            # 从请求中获取title和essay_text
            title = request.data.get('title', '')
            essay_text = request.data.get('essay_text', '')

            if not title or not essay_text:
                return Response({'error': '作文标题和内容不能为空'}, status=status.HTTP_400_BAD_REQUEST)

            # 构造query
            title_json = json.dumps({"作文标题": title}, ensure_ascii=False)
            article_json = json.dumps({"作文内容": essay_text}, ensure_ascii=False)
            query = "作文标题：" + title_json + " 作文内容：" + article_json

            # 调用分析函数
            sparkApi(query, 'write')

            # 打印分析结果
            logger.debug("Result: %s", res)

            return Response({'result': res}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#教学计划方案生成
class TeachingPlanView(APIView):

    def post(self, request):
        try:
            # 从请求中获取teaching_plan_request
            teaching_plan_request = request.data.get('teaching_plan_request', '')

            if not teaching_plan_request:
                return Response({'error': '教学计划请求内容不能为空'}, status=status.HTTP_400_BAD_REQUEST)

            # 构造query
            query = teaching_plan_request

            # 调用分析函数
            sparkApi(query, 'plan')

            # 打印分析结果
            logger.debug("Result: %s", res)

            # 将结果转换为字符串并返回
            result_text = "\n".join(res)

            return Response({'result': result_text}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DiaryListView(APIView):
    def get(self, request):
        try:
            # 获取当前用户的 ID
            user_id = request.user.id
            if not user_id:
                return Response({'error': '缺少用户ID'}, status=status.HTTP_400_BAD_REQUEST)
            # 从数据库中读取当前用户的日记
            diaries = Diary.objects.filter(user_id=user_id)
            serializer = DiarySerializer(diaries, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            user_id = request.user.id
            if not user_id:
                return Response({'error': '缺少用户ID'}, status=status.HTTP_400_BAD_REQUEST)

            request.data['user'] = user_id
            serializer = DiarySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DiarySummaryView(APIView):
    def post(self, request):
        try:
            # 获取当前用户的 ID
            user_id = request.user.id
            if not user_id:
                return Response({'error': '缺少用户ID'}, status=status.HTTP_400_BAD_REQUEST)

            current_date = datetime.datetime.now().date()
            start_date = current_date - datetime.timedelta(days=7)
            end_date = current_date + datetime.timedelta(days=7)

            # 从数据库中读取当前用户的日记
            diaries = Diary.objects.filter(user_id=user_id,date__range=[start_date,end_date])

            # 组织数据进行分析
            diary_data = [{"title": diary.title, "date": diary.date.strftime("%Y-%m-%d"), "mood": diary.mood, "content": diary.content} for diary in diaries]

            # 构造查询
            query = f"日记内容：{json.dumps(diary_data)}"
            logger.debug("Query: %s", query)

            # 调用分析函数
            res = sparkApi(query, 'diary')

            # 检查并返回分析结果
            if res is not None:
                logger.debug("Result: %s", res)
                return Response({'result': res}, status=status.HTTP_200_OK)
            else:
                logger.error("sparkApi returned null result")
                return Response({'result': None}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)