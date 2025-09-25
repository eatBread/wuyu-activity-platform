'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, FileText, Play, ClipboardList, Target, Eye, Copy, Calendar, User } from 'lucide-react'
import { useRole } from '../../contexts/RoleContext'
import { getAllTemplates, getTemplatesByCategory, categoryMap } from '../../lib/mockData'

export default function TemplatesPage() {
  const { currentRole, setCurrentRole } = useRole()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: UserCheck, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)
  
  // 获取模板数据
  const allTemplates = getAllTemplates()
  const filteredTemplates = selectedCategory === 'all' 
    ? allTemplates 
    : getTemplatesByCategory(selectedCategory)

  // 流程环节类型图标映射
  const stepTypeIcons = {
    content: FileText,
    checkin: UserCheck,
    video: Play,
    questionnaire: ClipboardList,
    task: Target
  }

  const stepTypeColors = {
    content: 'bg-blue-500',
    checkin: 'bg-green-500',
    video: 'bg-purple-500',
    questionnaire: 'bg-orange-500',
    task: 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 测试角色切换面板 */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border">
        <h3 className="text-sm font-medium text-gray-700 mb-2">测试角色切换</h3>
        <div className="space-y-2">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id as any)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  currentRole === role.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{role.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">五育活动</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/activities" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                活动广场
              </Link>
              <Link 
                href="/plans" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                活动计划
              </Link>
              <Link 
                href="/templates" 
                className="text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                模板中心
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                数据看板
              </Link>
              <div className="flex items-center space-x-2">
                {(() => {
                  const IconComponent = currentRoleInfo?.icon || GraduationCap
                  return (
                    <>
                      <div className={`${currentRoleInfo?.color} p-1 rounded-full`}>
                        <IconComponent className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{currentRoleInfo?.name}</span>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">活动模板中心</h1>
          <p className="text-gray-600">选择预设的活动模板，快速创建标准化活动</p>
        </div>

        {/* 统计信息 */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">模板统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{allTemplates.length}</div>
              <div className="text-sm text-gray-600">总模板数</div>
            </div>
            {Object.entries(categoryMap).map(([key, category]) => {
              const count = getTemplatesByCategory(key).length
              return (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{category.name}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 类别筛选 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              全部模板
            </button>
            {Object.entries(categoryMap).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  selectedCategory === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 模板列表 */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
            <p className="text-gray-600">当前类别下没有可用的活动模板</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* 模板封面 */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={template.coverImage}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/activities/default.png'
                    }}
                  />
                  {/* 类别标识 */}
                  <div className="absolute top-3 left-3 flex space-x-1">
                    {template.categories.map((categoryKey) => {
                      const category = categoryMap[categoryKey as keyof typeof categoryMap]
                      if (!category) return null
                      return (
                        <div
                          key={categoryKey}
                          className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center text-white text-sm font-bold`}
                          title={category.name}
                        >
                          {category.short}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 模板信息 */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                  
                  {/* 流程环节预览 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">包含环节：</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.templateData.processSteps.slice(0, 4).map((step, index) => {
                        const Icon = stepTypeIcons[step.type]
                        return (
                          <div
                            key={step.id}
                            className={`${stepTypeColors[step.type]} text-white px-2 py-1 rounded text-xs flex items-center space-x-1`}
                          >
                            <Icon className="h-3 w-3" />
                            <span>{step.title}</span>
                          </div>
                        )
                      })}
                      {template.templateData.processSteps.length > 4 && (
                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{template.templateData.processSteps.length - 4}个
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 模板元信息 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{template.createdBy === 'system' ? '系统' : '用户'}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // TODO: 预览模板详情
                        console.log('预览模板:', template.id)
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>预览</span>
                    </button>
                    <button
                      onClick={() => {
                        // TODO: 使用模板创建活动
                        console.log('使用模板:', template.id)
                      }}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>使用模板</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

