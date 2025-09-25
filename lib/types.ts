// 用户角色枚举
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  GROUP_LEADER = 'GROUP_LEADER',
  PRINCIPAL = 'PRINCIPAL'
}

// 活动分类枚举（五育）
export enum ActivityCategory {
  MORAL_EDUCATION = 'MORAL_EDUCATION',      // 思想品德
  ACADEMIC_LEVEL = 'ACADEMIC_LEVEL',        // 学业水平
  PHYSICAL_HEALTH = 'PHYSICAL_HEALTH',      // 身心健康
  ARTISTIC_LITERACY = 'ARTISTIC_LITERACY',  // 艺术素养
  SOCIAL_PRACTICE = 'SOCIAL_PRACTICE'       // 社会实践
}

// 活动类型枚举
export enum ActivityType {
  COMPETITION = 'COMPETITION',    // 竞赛
  WORKSHOP = 'WORKSHOP',          // 工作坊
  LECTURE = 'LECTURE',            // 讲座
  PRACTICE = 'PRACTICE',          // 实践
  EXHIBITION = 'EXHIBITION',      // 展览
  PERFORMANCE = 'PERFORMANCE',    // 表演
  OTHER = 'OTHER'                 // 其他
}

// 活动状态枚举
export enum ActivityStatus {
  UPCOMING = 'UPCOMING',    // 即将开始
  ONGOING = 'ONGOING',      // 进行中
  COMPLETED = 'COMPLETED',  // 已完成
  CANCELLED = 'CANCELLED'   // 已取消
}

// 计划状态枚举
export enum PlanStatus {
  PENDING = 'PENDING',    // 待审批
  APPROVED = 'APPROVED',  // 已审批
  REJECTED = 'REJECTED'   // 已拒绝
}

// 参与状态枚举
export enum ParticipationStatus {
  REGISTERED = 'REGISTERED',      // 已报名
  PARTICIPATING = 'PARTICIPATING', // 参与中
  COMPLETED = 'COMPLETED',        // 已完成
  ABSENT = 'ABSENT'               // 缺席
}

// 用户接口
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// 活动接口
export interface Activity {
  id: string
  title: string
  description?: string
  content?: string
  category: ActivityCategory
  type: ActivityType
  startDate?: Date
  endDate?: Date
  location?: string
  maxParticipants?: number
  status: ActivityStatus
  createdAt: Date
  updatedAt: Date
  creatorId: string
  planId?: string
}

// 活动计划接口
export interface ActivityPlan {
  id: string
  title: string
  description?: string
  category: ActivityCategory
  semester: string
  status: PlanStatus
  createdAt: Date
  updatedAt: Date
  creatorId: string
  approverId?: string
}

// 参与记录接口
export interface Participation {
  id: string
  status: ParticipationStatus
  joinedAt: Date
  completedAt?: Date
  notes?: string
  userId: string
  activityId: string
}

// 分类映射
export const categoryMap = {
  [ActivityCategory.MORAL_EDUCATION]: { name: '思想品德', color: 'bg-red-500' },
  [ActivityCategory.ACADEMIC_LEVEL]: { name: '学业水平', color: 'bg-blue-500' },
  [ActivityCategory.PHYSICAL_HEALTH]: { name: '身心健康', color: 'bg-green-500' },
  [ActivityCategory.ARTISTIC_LITERACY]: { name: '艺术素养', color: 'bg-purple-500' },
  [ActivityCategory.SOCIAL_PRACTICE]: { name: '社会实践', color: 'bg-orange-500' }
}

// 状态映射
export const statusMap = {
  [ActivityStatus.UPCOMING]: { name: '即将开始', color: 'bg-blue-100 text-blue-800' },
  [ActivityStatus.ONGOING]: { name: '进行中', color: 'bg-green-100 text-green-800' },
  [ActivityStatus.COMPLETED]: { name: '已完成', color: 'bg-gray-100 text-gray-800' },
  [ActivityStatus.CANCELLED]: { name: '已取消', color: 'bg-red-100 text-red-800' }
}

// 计划状态映射
export const planStatusMap = {
  [PlanStatus.PENDING]: { name: '待审批', color: 'bg-yellow-100 text-yellow-800' },
  [PlanStatus.APPROVED]: { name: '已审批', color: 'bg-green-100 text-green-800' },
  [PlanStatus.REJECTED]: { name: '已拒绝', color: 'bg-red-100 text-red-800' }
}
