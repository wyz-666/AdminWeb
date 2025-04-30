# 使用官方的 Node 镜像作为基础镜像
FROM node:16.13.2 AS builder

# 设置工作目录
WORKDIR /app
 
# 将项目文件复制到工作目录
COPY . .
# 安装 npm 并安装项目依赖
RUN npm install 
 
# 构建前端应用
RUN npm run build
 
# # 使用 Nginx 镜像作为基础镜像
FROM nginx:latest
# 覆盖配置文件
# COPY nginx.conf /etc/nginx/nginx.conf
 
# # 将构建后的静态文件复制到 Nginx 的默认 HTML 目录
COPY --from=builder /app/dist /usr/share/nginx/html
 
 
# 容器启动时启动 Nginx
CMD ["nginx", "-g", "daemon off;"]