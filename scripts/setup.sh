#!/bin/bash

echo "🚀 五育活动管理系统 - 快速设置"
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js (https://nodejs.org/)"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 复制环境配置文件
if [ ! -f .env ]; then
    echo "📝 创建环境配置文件..."
    cp env.example .env
    echo "✅ 环境配置文件已创建，请根据需要修改 .env 文件"
fi

# 生成 Prisma 客户端
echo "🗄️ 设置数据库..."
npx prisma generate

# 推送数据库模式
echo "📊 初始化数据库..."
npx prisma db push

echo ""
echo "🎉 设置完成！"
echo ""
echo "启动开发服务器："
echo "  npm run dev"
echo ""
echo "访问应用："
echo "  http://localhost:3000"
echo ""
echo "数据库管理："
echo "  npx prisma studio"
echo ""
