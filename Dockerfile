# 使用 Node.js 22 作为基础镜像
FROM node:22-bookworm

# 设置工作目录
WORKDIR /app

# 复制 package.json
COPY client/package.json ./client/

# 安装依赖
RUN cd client && npm install

# 复制源代码
COPY client/ ./

# 设置环境变量
ENV EXPO_PUBLIC_BACKEND_BASE_URL=https://gift-app-production-b551.up.railway.app

# 构建 Expo Web
RUN npx expo export --platform web

# 使用 nginx 来托管静态文件
FROM nginx:alpine

# 复制构建产物
COPY --from=0 /app/client/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
