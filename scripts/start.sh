#!/bin/bash

echo "启动宏观数据洞察项目..."

# 启动后端服务
echo "启动后端服务 (端口 3001)..."
cd backend
npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务
echo "启动前端服务 (端口 3000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "服务启动完成！"
echo "前端地址: http://localhost:3000"
echo "后端API: http://localhost:3001/api/health"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait 