from datetime import timedelta

import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from services.AI_API_CALL import RateLimitException, InvalidRoleException, AIAdviceService
from .models import Day, Task
from .serializers import DaySerializer, TaskSerializer


class DayListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = Day.objects.filter(user=request.user)
        serializer = DaySerializer(days, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        date = data.get('date')

        if not date:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)

        existing_day = Day.objects.filter(user=request.user, date=date).first()

        if existing_day:
            # 合并任务
            tasks_data = data.get('tasks', [])
            for task_data in tasks_data:
                task_serializer = TaskSerializer(data=task_data)
                if task_serializer.is_valid():
                    task_serializer.save(day=existing_day)
                else:
                    return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            existing_day_serializer = DaySerializer(existing_day)
            return Response(existing_day_serializer.data, status=status.HTTP_200_OK)
        else:
            # 创建新的 Day 实例
            serializer = DaySerializer(data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnalyzeTasksAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_type=request.user.user_type
            # 获取当前日期
            current_date = datetime.datetime.now().date()
            start_date = current_date - timedelta(days=7)
            end_date = current_date + timedelta(days=7)

            # 获取时间范围内的天数据
            days = Day.objects.filter(user=request.user, date = current_date)

            # if not days.exists():
            #     return Response({'error': 'No tasks found for the specified date range.'},
            #                     status=status.HTTP_404_NOT_FOUND)

            # 创建AI服务实例
            ai_service = AIAdviceService()
            if user_type == 'teacher':
                ai_service.add_param('system', "你是一个擅长总结每天任务情况的任务总结大师，你善于跟踪、分析和总结任务的进展情况，确保任务按时完成，并提供适当的反馈和建议以提高效率。你现在的任务是总结老师每天的任务情况，你现在总结的任务的对象是老师。""任务要求：1、完全记住老师每天的任务内容，避免出现总结内容与任务内容不符。2、回答要亲切地道，避免机器化回答。")
            elif user_type == 'student':
                ai_service.add_param('system', "你是一个擅长总结每天任务情况的任务总结大师，你善于跟踪、分析和总结任务的进展情况，确保任务按时完成，并提供适当的反馈和建议以提高效率。你现在的任务是总结学生每天的任务情况，你现在总结的任务的对象是学生。""任务要求：1、完全记住学生每天的任务内容，避免出现总结内容与任务内容不符。2、回答要亲切地道，避免机器化回答。")
            # 添加每个任务的数据到AI服务中
            cnt=0
            for day in days:
                for task in day.tasks.all():
                    print(task.task_name,task.status)
                    cnt += 1
                    ai_service.add_param('user', f"当天任务{cnt}: {task.task_name}, 状态: {task.status}")

            if cnt ==0:
                ai_service.add_param('user', f"当天任务数量为零")
            # 获取AI生成的总结
            advice = ai_service.get_advice(user_id=request.user.id)
            print(advice)
            resp = {}
            resp['weeklySummary'] = advice['choices'][0]['message']['content']
            # 返回AI生成的总结
            return Response(resp,
                            status=status.HTTP_200_OK)

        except RateLimitException as e:
            return Response({'error': str(e)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        except InvalidRoleException as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'error': 'An error occurred while analyzing tasks'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TaskUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, day__user=request.user)
            serializer = TaskSerializer(task, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)