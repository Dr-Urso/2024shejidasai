import datetime
import ssl

import requests
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from HEUENHELPER import settings
from .models import ExamSummary, ExamInfo, BaseInfo, Document, Question
from userLogin.models import Student, Teacher  # 引入 Student 和 Teacher 模型
from .webApi.sparkAPI import sparkApi, res
from .models import Diary
from .serializers import DiarySerializer
from userLogin.models import User, Student


class GetBaseInfoView(APIView):

    def get(self, request):
        student_id = request.query_params.get('student_id')
        try:
            student = Student.objects.filter(student_id=student_id).first()
            if not student:
                return Response({'error': '无效的 student_id'}, status=status.HTTP_400_BAD_REQUEST)

            base_info = BaseInfo.objects.filter(student=student).first()
            if not base_info:
                return Response({'message': '基础信息未找到'}, status=status.HTTP_404_NOT_FOUND)

            data = {
                'student_id': student_id,
                'education_level': base_info.education_level,
                'subject': base_info.subject,
                'fullMark': base_info.fullMark
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SaveInfoView(APIView):

    def post(self, request):
        try:
            student_id = request.data['student_id']
            subject = request.data['subject']
            fullMark = request.data['fullMark']
            education_level = request.data.get('education_level', '')

            # 验证 student_id 是否存在
            student = Student.objects.filter(student_id=student_id).first()
            if not student:
                return Response({'error': '无效的 student_id'}, status=status.HTTP_400_BAD_REQUEST)

            # 检查是否已经存在记录
            base_info = BaseInfo.objects.filter(student=student).first()
            if base_info:
                base_info.subject = subject
                base_info.fullMark = fullMark
                base_info.education_level = education_level
                base_info.save()
            else:
                base_info = BaseInfo(
                    student=student,
                    subject=subject,
                    fullMark=fullMark,
                    education_level=education_level
                )
                base_info.save()

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
from services.AI_API_CALL import RateLimitException, AIAdviceService, InvalidRoleException

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
            query = f"考试成绩：{score_json}\n考试的名称：{subject_json}\n学生的自我评价：{data_json}"
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
from datetime import timedelta
import datetime
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import  ExamInfoSerializer

class UserExamScoresAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student = Student.objects.filter(user=request.user).first()
            if not student:
                return Response({'error': '无效的用户'}, status=status.HTTP_400_BAD_REQUEST)

            exam_infos = ExamInfo.objects.filter(student=student)
            serializer = ExamInfoSerializer(exam_infos, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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

            #检测是否含有敏感内容
            try:
                ai_service = AIAdviceService()
                ai_service.add_param('user',essay_text+title)
                user_id=request.user.id
                advice = ai_service.get_advice(user_id=user_id)
            except Exception as e:
                print(e)
                return Response({"error": "包含敏感内容,错误码10013"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            result_text = "".join(res)

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


import hashlib
import base64
import hmac
import time
import json
import websocket
import ssl
import logging
import requests
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Document, Question

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class DocumentUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            logger.debug('No file uploaded')
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        document = Document(file=file, file_name=file.name)
        document.save()

        upload_response = self.upload_document(document)
        if upload_response.status_code != 200:
            logger.debug(f'Failed to upload document: {upload_response.status_code} - {upload_response.text}')
            return JsonResponse({'error': 'Failed to upload document'}, status=upload_response.status_code)

        response_data = upload_response.json()
        file_id = response_data['data']['fileId']
        document.file_id = file_id
        document.save()

        logger.debug(f'Document uploaded successfully: document_id={document.id}, file_id={file_id}')
        return JsonResponse({'message': 'Document uploaded successfully', 'document_id': document.id, 'file_id': file_id})

    def upload_document(self, document):
        APPId = settings.APP_ID
        APISecret = settings.API_SECRET
        timestamp = str(int(time.time()))
        request_url = "https://chatdoc.xfyun.cn/openapi/v1/file/upload"

        signature = self.get_signature(APPId, APISecret, timestamp)
        headers = {
            "appId": APPId,
            "timestamp": timestamp,
            "signature": signature,
        }

        files = {'file': document.file}
        body = {
            "url": "",
            "fileName": document.file_name,
            "fileType": document.file_type,
            "needSummary": False,
            "stepByStep": False,
            "callbackUrl": "your_callbackUrl",
        }

        response = requests.post(request_url, files=files, data=body, headers=headers)
        logger.debug(f'Upload document response: {response.status_code} - {response.text}')
        return response

    def get_signature(self, APPId, APISecret, timestamp):
        m2 = hashlib.md5()
        data = bytes(APPId + timestamp, encoding="utf-8")
        m2.update(data)
        checkSum = m2.hexdigest()
        signature = hmac.new(APISecret.encode('utf-8'), checkSum.encode('utf-8'), digestmod=hashlib.sha1).digest()
        return base64.b64encode(signature).decode(encoding='utf-8')


class DocumentQAndAView(APIView):
    def post(self, request):
        logger.debug(f'Request body: {request.body}')
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            logger.debug('Invalid JSON received')
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        document_id = data.get('document_id')
        question_text = data.get('question')

        if not document_id or not question_text:
            logger.debug('Document ID and question are required')
            return JsonResponse({'error': 'Document ID and question are required'}, status=400)

        try:
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            logger.debug(f'Document not found: document_id={document_id}')
            return JsonResponse({'error': 'Document not found'}, status=404)

        question = Question(document=document, question=question_text)
        question.save()

        answer = self.ask_question(document, question_text)
        question.answer = answer
        question.save()

        logger.debug(f'Question asked: question_text={question_text}, answer={answer}')
        return JsonResponse({'question': question_text, 'answer': answer})

    def ask_question(self, document, question_text):
        APPId = settings.APP_ID
        APISecret = settings.API_SECRET
        timestamp = str(int(time.time()))
        origin_url = "wss://chatdoc.xfyun.cn/openapi/chat"

        signature = self.get_signature(APPId, APISecret, timestamp)
        ws_url = f"{origin_url}?appId={APPId}&timestamp={timestamp}&signature={signature}"

        complete_answer = []

        def on_message(ws, message):
            logger.debug(f'WebSocket message received: {message}')
            data = json.loads(message)
            if data.get('status') == 2:
                ws.close()
            content = data.get('content', '')
            complete_answer.append(content)

        def on_error(ws, error):
            logger.debug(f'WebSocket error: {error}')
            complete_answer.append('Error occurred')

        def on_close(ws, close_status_code, close_msg):
            logger.debug(f'WebSocket connection closed with status: {close_status_code}, message: {close_msg}')

        def on_open(ws):
            logger.debug('WebSocket connection opened')
            body = {
                "chatExtends": {
                    "wikiPromptTpl": "请将以下内容作为已知信息：\n<wikicontent>\n请根据以上内容回答用户的问题。\n问题:<wikiquestion>\n回答:",
                    "wikiFilterScore": 0.83,
                    "temperature": 0.5
                },
                "fileIds": [
                    document.file_id  # 使用正确的 file_id
                ],
                "messages": [
                    {
                        "role": "user",
                        "content": question_text
                    }
                ]
            }
            ws.send(json.dumps(body))

        websocket.enableTrace(True)
        ws = websocket.WebSocketApp(ws_url,
                                    on_message=on_message,
                                    on_error=on_error,
                                    on_close=on_close,
                                    on_open=on_open)
        ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})

        return ''.join(complete_answer)

    def get_signature(self, APPId, APISecret, timestamp):
        m2 = hashlib.md5()
        data = bytes(APPId + timestamp, encoding="utf-8")
        m2.update(data)
        checkSum = m2.hexdigest()
        signature = hmac.new(APISecret.encode('utf-8'), checkSum.encode('utf-8'), digestmod=hashlib.sha1).digest()
        return base64.b64encode(signature).decode(encoding='utf-8')


import time
import requests
import hashlib
import base64
import hmac
import logging

from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Document

logger = logging.getLogger(__name__)


class DocumentSummaryView(APIView):
    def post(self, request):
        document_id = request.data.get('document_id')
        if not document_id:
            return JsonResponse({'error': 'Document ID is required'}, status=400)

        try:
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return JsonResponse({'error': 'Document not found'}, status=404)
        time.sleep(5)  # 等待5秒后再获取总结结果
        # 发起文档总结请求
        start_response = self.start_document_summary(document)
        if start_response.status_code != 200:
            return JsonResponse({'error': 'Failed to start document summary'}, status=start_response.status_code)

        start_data = start_response.json()
        logger.debug(f'Start summary response data: {start_data}')

        if start_data['code'] != 0:
            return JsonResponse({'error': start_data.get('desc', 'Unknown error')}, status=400)

        # 轮询获取总结结果
        summary_response = self.poll_document_summary(document.file_id)
        if summary_response.status_code != 200:
            return JsonResponse({'error': 'Failed to get document summary'}, status=summary_response.status_code)

        response_data = summary_response.json()
        logger.debug(f'Summary response data: {response_data}')

        if response_data.get('data') is None:
            return JsonResponse({'error': 'No summary data available'}, status=400)

        document.summary = response_data['data'].get('summary', '')
        document.save()

        return JsonResponse({'message': 'Document summarized successfully', 'summary': document.summary})

    def start_document_summary(self, document):
        APPId = settings.APP_ID
        APISecret = settings.API_SECRET
        timestamp = str(int(time.time()))
        request_url = "https://chatdoc.xfyun.cn/openapi/v1/file/summary/start"

        signature = self.get_signature(APPId, APISecret, timestamp)
        headers = {
            "appId": APPId,
            "timestamp": timestamp,
            "signature": signature,
        }

        files = {
            "fileId": (None, document.file_id)
        }

        response = requests.post(request_url, files=files, headers=headers)
        logger.debug(f'Start summary response: {response.status_code} - {response.text}')
        return response

    def poll_document_summary(self, file_id):
        APPId = settings.APP_ID
        APISecret = settings.API_SECRET
        timestamp = str(int(time.time()))
        request_url = "https://chatdoc.xfyun.cn/openapi/v1/file/summary/query"

        signature = self.get_signature(APPId, APISecret, timestamp)
        headers = {
            "appId": APPId,
            "timestamp": timestamp,
            "signature": signature,
        }

        files = {
            "fileId": (None, file_id)
        }

        max_attempts = 10
        for attempt in range(max_attempts):
            response = requests.post(request_url, files=files, headers=headers)
            logger.debug(f'Poll summary attempt {attempt + 1}/{max_attempts}: {response.status_code} - {response.text}')

            if response.status_code == 200:
                data = response.json()
                if data.get('data') is not None:
                    return response

            time.sleep(5)  # 等待5秒后重试

        return response

    def get_signature(self, APPId, APISecret, timestamp):
        m2 = hashlib.md5()
        data = bytes(APPId + timestamp, encoding="utf-8")
        m2.update(data)
        checkSum = m2.hexdigest()
        signature = hmac.new(APISecret.encode('utf-8'), checkSum.encode('utf-8'), digestmod=hashlib.sha1).digest()
        return base64.b64encode(signature).decode(encoding='utf-8')
