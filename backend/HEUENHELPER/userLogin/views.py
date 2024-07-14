from django.db import transaction
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Student, Teacher
from django.contrib.auth import authenticate, login, logout
import logging

logger = logging.getLogger(__name__)

class CreateUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user_type = request.data.get('user_type')
        student_id = request.data.get('student_id')
        employee_id = request.data.get('employee_id')

        logger.debug(f"Received data: username={username}, password={password}, user_type={user_type}, student_id={student_id}, employee_id={employee_id}")

        if not username or len(username) == 0:
            return Response({'detail': '用户名为空'}, status=status.HTTP_400_BAD_REQUEST)
        if len(username) > 16:
            return Response({'detail': '用户名长度不超过16个字符'}, status=status.HTTP_400_BAD_REQUEST)
        if not password or len(password) == 0:
            return Response({'detail': '密码为空'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'detail': '用户名已被使用'}, status=status.HTTP_400_BAD_REQUEST)
        if user_type not in ['student', 'teacher']:
            return Response({'detail': '用户类型错误'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    user_type=user_type,
                )
                if user_type == 'student':
                    student = Student.objects.create(user=user, student_id=student_id)
                elif user_type == 'teacher':
                    teacher = Teacher.objects.create(user=user, employee_id=employee_id)

                return Response({'detail': 'OK'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error during user creation: {e}")
            return Response({'detail': '内部错误'}, status=status.HTTP_400_BAD_REQUEST)



# 登录视图函数
class LoginUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or len(username) == 0:
            return Response({'detail': '用户名为空'}, status=status.HTTP_400_BAD_REQUEST)
        if not password or len(password) == 0:
            return Response({'detail': '密码为空'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            student_id = teacher_id = None
            if user.user_type == 'student' and hasattr(user, 'student') and user.student:
                student_id = user.student.student_id
            elif user.user_type == 'teacher' and hasattr(user, 'teacher') and user.teacher:
                teacher_id = user.teacher.employee_id
            return Response({
                'detail': 'OK',
                'student_id': student_id,
                'teacher_id': teacher_id
            })
        else:
            return Response({'detail': '登录失败'}, status=status.HTTP_400_BAD_REQUEST)





# 退出登录
class LogoutUserView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': '未登录'}, status=status.HTTP_400_BAD_REQUEST)
        # 退出登录
        logout(request)
        return Response({'detail': 'OK'})


class ShowLoginStatus(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            current_user = {
                'id': request.user.id,
                'name': str(request.user.get_username()),
                'create_time': request.user.create_time,
                'update_time': request.user.update_time,
            }
            return Response({'detail': current_user})
        else:
            return Response({'detail': '未登录！'})
