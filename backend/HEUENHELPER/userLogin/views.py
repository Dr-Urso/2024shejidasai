from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login, logout

from .models import User


# Create your views here.
# 业务代码写在这
# 命中的这个函数如下，由于是注册用户，所以应该是post方法
class CreateUserView(APIView):

    def post(self, request):
        if (username := request.data.get('username')) is None or (len(username) == 0):
            return Response({'detail': '用户名为空'}, status=status.HTTP_400_BAD_REQUEST)
        if len(username) > 16:
            return Response({'detail': '用户名长度不超过16个字符'}, status=status.HTTP_400_BAD_REQUEST)
        if ((password := request.data.get('password')) is None) or len(password) == 0:
            return Response({'detail': '密码为空'}, status=status.HTTP_400_BAD_REQUEST)
        # 验证新用户名是否重复
        if User.objects.filter(username=username).first():
            return Response({'detail': '用户名已被使用'}, status=status.HTTP_400_BAD_REQUEST)
        # 没啥问题开始创建账号
        try:
            user = User.objects.create_user(
                username=username,
                password=password,
            )
        except Exception as e:
            print(e)
            return Response({'detail': '内部错误'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'OK'})


# 登录视图函数
class LoginUserView(APIView):
    def post(self, request):
        if (username := request.data.get('username')) is None or (len(username) == 0):
            return Response({'detail': '用户名为空'}, status=status.HTTP_400_BAD_REQUEST)
        if ((password := request.data.get('password')) is None) or len(password) == 0:
            return Response({'detail': '密码为空'}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=username, password=password)
        # 验证是否成功
        if user is not None:
            login(request, user)
            return Response({'detail': 'OK'})
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
