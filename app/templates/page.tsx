'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, FileText, Play, ClipboardList, Target, Eye, Copy, Calendar, User, Plus, Edit } from 'lucide-react'
import { useRole } from '../../contexts/RoleContext'
import { getAllTemplates, getTemplatesByCategory, categoryMap, observationPoints } from '../../lib/mockData'

export default function TemplatesPage() {
  const { currentRole, setCurrentRole } = useRole()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [allTemplates, setAllTemplates] = useState<any[]>([])
  
  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: UserCheck, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)
  
  // 获取模板数据
  useEffect(() => {
    const templates = getAllTemplates()
    setAllTemplates(templates)
  }, [])
  
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

  // 处理模板预览
  const handleTemplatePreview = (template: any) => {
    setPreviewTemplate(template)
    setShowPreviewModal(true)
  }

  // 处理使用模板
  const handleTemplateSelect = (templateId: string) => {
    // 跳转到创建活动页面，并传递模板ID
    window.location.href = `/activities/create?templateId=${templateId}`
  }

  // 处理编辑模板
  const handleTemplateEdit = (templateId: string) => {
    // TODO: 跳转到编辑模板页面
    console.log('编辑模板:', templateId)
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
                onClick={() => {
                  console.log('Switching role to:', role.id)
                  setCurrentRole(role.id as 'STUDENT' | 'TEACHER' | 'GROUP_LEADER' | 'PRINCIPAL')
                }}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">活动模板中心</h1>
              <p className="text-gray-600">选择预设的活动模板，快速创建标准化活动</p>
            </div>
            {/* 创建模板按钮 - 教师、组长和校长可见 */}
            {(currentRole === 'TEACHER' || currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
              <Link 
                href="/templates/create" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>创建模板</span>
              </Link>
            )}
          </div>
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
              <div 
                key={template.id} 
                onClick={() => handleTemplatePreview(template)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
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
                    {template.categories.map((categoryKey: string) => {
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
                      {template.templateData.processSteps.slice(0, 4).map((step: any, index: number) => {
                        const Icon = stepTypeIcons[step.type as keyof typeof stepTypeIcons]
                        return (
                          <div
                            key={step.id}
                            className={`${stepTypeColors[step.type as keyof typeof stepTypeColors]} text-white px-2 py-1 rounded text-xs flex items-center space-x-1`}
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
                      <span>{new Date(template.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{template.createdBy === 'system' ? '系统' : '用户'}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    {/* 编辑模板按钮 - 只有组长和校长可见 */}
                    {(currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTemplateEdit(template.id)
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>编辑模板</span>
                      </button>
                    )}
                    
                    {/* 使用模板按钮 - 教师、组长和校长可见 */}
                    {(currentRole === 'TEACHER' || currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTemplateSelect(template.id)
                        }}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Copy className="h-4 w-4" />
                        <span>使用模板</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 模板预览模态框 */}
      {showPreviewModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">模板预览</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* 模板基本信息 */}
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={previewTemplate.coverImage}
                      alt={previewTemplate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/activities/default.png'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{previewTemplate.name}</h3>
                    <p className="text-gray-600 mb-4">{previewTemplate.description}</p>

                    {/* 类别标签 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {previewTemplate.categories.map((categoryKey: string) => {
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

                    {/* 模板元信息 */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(previewTemplate.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{previewTemplate.createdBy === 'system' ? '系统' : '用户'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 活动基本信息预览 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">活动基本信息</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">活动标题</label>
                      <p className="text-gray-900">{previewTemplate.templateData.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">活动地点</label>
                      <p className="text-gray-900">{previewTemplate.templateData.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">活动时间</label>
                      <p className="text-gray-900">
                        {previewTemplate.templateData.startDate} {previewTemplate.templateData.startTime} - {previewTemplate.templateData.endTime}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">最大参与人数</label>
                      <p className="text-gray-900">{previewTemplate.templateData.maxParticipants}人</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">活动描述</label>
                    <p className="text-gray-900 mt-1">{previewTemplate.templateData.description}</p>
                  </div>
                </div>
              </div>

              {/* 综评观测点预览 */}
              {previewTemplate.templateData.observationPoints && previewTemplate.templateData.observationPoints.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">综评观测点</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {previewTemplate.templateData.observationPoints.map((pointId: string) => {
                        // 从观测点数据中查找对应的观测点信息
                        const point = observationPoints.find(p => p.id === pointId)
                        if (!point) return null
                        
                        const category = categoryMap[point.category as keyof typeof categoryMap]
                        return (
                          <div key={pointId} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className={`w-8 h-8 rounded-full ${category?.color || 'bg-gray-500'} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                              {pointId}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium text-gray-900">{point.name}</h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${category?.color || 'bg-gray-500'} text-white`}>
                                  {category?.name || '未知类别'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{point.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 活动流程预览 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">活动流程</h4>
                <div className="space-y-3">
                  {previewTemplate.templateData.processSteps.map((step: any, index: number) => {
                    const Icon = stepTypeIcons[step.type as keyof typeof stepTypeIcons]
                    const color = stepTypeColors[step.type as keyof typeof stepTypeColors]

                    return (
                      <div key={step.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Icon className="h-4 w-4 text-gray-600" />
                            <h5 className="font-medium text-gray-900">{step.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${color} text-white`}>
                              {step.type}
                            </span>
                          </div>
                          {step.data && (
                            <div className="text-sm text-gray-600">
                              {step.type === 'content' && step.data.content && (
                                <div
                                  className="prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: step.data.content }}
                                />
                              )}
                              {step.type === 'checkin' && step.data.description && (
                                <p>{step.data.description}</p>
                              )}
                              {step.type === 'video' && step.data.title && (
                                <p>视频标题：{step.data.title}</p>
                              )}
                              {step.type === 'questionnaire' && step.data.title && (
                                <p>问卷标题：{step.data.title}</p>
                              )}
                              {step.type === 'task' && step.data.title && (
                                <p>任务标题：{step.data.title}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false)
                    handleTemplateSelect(previewTemplate.id)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>使用此模板</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

