# 五育活动管理系统

一个专为学校设计的五育（德智体美劳）活动管理平台，支持学生、教师、教师组长和校长四种角色的协同管理。

## 功能特色

### 🎯 五育并举
- **思想品德**：德育活动，培养学生良好品德
- **学业水平**：智育活动，提升学生学习能力  
- **身心健康**：体育健康，促进学生身心发展
- **艺术素养**：美育活动，培养学生艺术修养
- **社会实践**：劳育实践，增强学生社会责任感

### 👥 多角色管理
- **学生**：参与活动，查看活动信息
- **教师**：创建活动，参与活动管理
- **教师组长**：创建活动计划，管理组内活动
- **校长**：审批活动计划，查看整体数据

### 📊 核心功能
- **活动广场**：展示所有活动，支持搜索和筛选
- **活动计划**：学期活动规划，支持审批流程
- **数据看板**：活动进度跟踪，数据可视化
- **用户管理**：角色权限控制，安全认证

## 技术栈

- **前端**：Next.js 14 + React 18 + TypeScript
- **样式**：Tailwind CSS
- **数据库**：Prisma + SQLite
- **认证**：NextAuth.js
- **图标**：Lucide React

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 设置数据库
```bash
npx prisma generate
npx prisma db push
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── activities/         # 活动广场页面
│   ├── login/             # 登录页面
│   ├── register/          # 注册页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── lib/                   # 工具函数和类型
│   ├── types.ts           # TypeScript 类型定义
│   └── utils.ts           # 工具函数
├── prisma/                # 数据库模型
│   └── schema.prisma      # Prisma 模式
└── public/                # 静态资源
```

## 数据库模型

### 用户模型 (User)
- 基本信息：姓名、邮箱、密码
- 角色：学生、教师、教师组长、校长
- 关联：创建的活动、参与记录、审批的计划

### 活动模型 (Activity)
- 基本信息：标题、描述、内容
- 分类：五育分类
- 时间：开始时间、结束时间
- 状态：即将开始、进行中、已完成、已取消

### 活动计划模型 (ActivityPlan)
- 计划信息：标题、描述、学期
- 状态：待审批、已审批、已拒绝
- 关联：创建者、审批者、包含的活动

### 参与记录模型 (Participation)
- 参与状态：已报名、参与中、已完成、缺席
- 时间记录：参与时间、完成时间
- 备注：参与成果或备注

## 开发计划

- [x] 项目基础架构搭建
- [x] 数据库模型设计
- [x] 用户认证系统
- [x] 活动广场页面
- [ ] 活动创建和管理
- [ ] 活动计划系统
- [ ] 数据看板
- [ ] 权限管理优化
- [ ] 移动端适配

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱：support@wuyu-activity.com
- 项目地址：https://github.com/your-username/wuyu-activity-system
