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
        serializer = DaySerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnalyzeTasksAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # 获取当前日期
            current_date = datetime.datetime.now().date()
            start_date = current_date - timedelta(days=7)
            end_date = current_date + timedelta(days=7)

            # 获取时间范围内的天数据
            days = Day.objects.filter(user=request.user, date = current_date)

            if not days.exists():
                return Response({'error': 'No tasks found for the specified date range.'},
                                status=status.HTTP_404_NOT_FOUND)

            # 创建AI服务实例
            ai_service = AIAdviceService()
            ai_service.add_param('system', "你是一个擅长总结每天任务情况的管理大师，你现在的任务是总结每天的任务情况。""任务要求：1、避免出现总结内容与任务内容不符。2、如果有很多任务未完成，提醒加快速度。")
            # 添加每个任务的数据到AI服务中
            for day in days:
                for task in day.tasks.all():

                    ai_service.add_param('user', f"任务: {task.task_name}, 状态: {task.status}")

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