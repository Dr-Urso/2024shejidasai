# backend/Dockerfile

# 使用官方的Python基础镜像
FROM python:3.12-slim

# 设置工作目录
WORKDIR /app

# 复制requirements.txt文件并安装依赖
COPY backend/HEUENHELPER/requirements.txt /app/requirements.txt
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install --no-cache-dir -r /app/requirements.txt

# 复制整个Django项目到工作目录
COPY backend/HEUENHELPER /app

# 设置环境变量
ENV PYTHONUNBUFFERED=1

# 运行Django应用
CMD ["gunicorn", "HEUENHELPER.wsgi:application", "--bind", "0.0.0.0:8000"]