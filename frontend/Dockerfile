# frontend/Dockerfile

# 使用官方的Nginx基础镜像
FROM nginx:alpine

# 复制构建好的前端文件到Nginx的html目录
COPY ./frontend/dist /usr/share/nginx/html

# 复制Nginx配置文件
COPY ./frontend/nginx.conf /etc/nginx/nginx.conf