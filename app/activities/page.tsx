'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Calendar, MapPin, Users, BookOpen, Heart, Palette, Globe, User, UserCheck, Crown, GraduationCap, X, Copy, Eye, FileText, Play, ClipboardList, Target } from 'lucide-react'
import { useRole } from '../../contexts/RoleContext'
import { useNavigation } from '../../contexts/NavigationContext'
import { useRouter } from 'next/navigation'
import { categoryMap, mockActivities, getAllTemplates, getTemplatesByCategory } from '../../lib/mockData'

// 使用共享的categoryMap

// 流程环节类型定义（用于预览）
const processStepTypes = [
  { 
    id: 'content', 
    name: '图文', 
    icon: FileText, 
    description: '支持富文本编辑，可添加图片和文字内容',
    color: 'bg-blue-500'
  },
  { 
    id: 'checkin', 
    name: '签到', 
    icon: UserCheck, 
    description: '参与者签到确认参与活动',
    color: 'bg-green-500'
  },
  { 
    id: 'video', 
    name: '视频', 
    icon: Play, 
    description: '播放教学视频或活动视频',
    color: 'bg-purple-500'
  },
  { 
    id: 'questionnaire', 
    name: '问卷', 
    icon: ClipboardList, 
    description: '收集参与者反馈和意见',
    color: 'bg-orange-500'
  },
  { 
    id: 'task', 
    name: '任务', 
    icon: Target, 
    description: '创建任务，收集参与者提交的内容',
    color: 'bg-red-500'
  }
]

const statusMap = {
  'UPCOMING': { name: '即将开始', color: 'bg-blue-100 text-blue-800' },
  'ONGOING': { name: '进行中', color: 'bg-green-100 text-green-800' },
  'COMPLETED': { name: '已完成', color: 'bg-gray-100 text-gray-800' },
  'CANCELLED': { name: '已取消', color: 'bg-red-100 text-red-800' }
}

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateCategory, setTemplateCategory] = useState('all')
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const { currentRole, setCurrentRole } = useRole()
  const { setLastPage } = useNavigation()
  const router = useRouter()

  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: User, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)

  // 获取模板数据
  const allTemplates = getAllTemplates()
  const filteredTemplates = templateCategory === 'all' 
    ? allTemplates 
    : getTemplatesByCategory(templateCategory)

  // 处理模板选择
  const handleTemplateSelect = (templateId: string | null) => {
    if (templateId) {
      router.push(`/activities/create?templateId=${templateId}`)
    } else {
      router.push('/activities/create')
    }
    setShowTemplateModal(false)
  }

  // 处理模板预览
  const handleTemplatePreview = (template: any) => {
    setPreviewTemplate(template)
    setShowPreviewModal(true)
  }

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || activity.categories?.includes(selectedCategory)
    const matchesStatus = !selectedStatus || activity.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
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
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                模板中心
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                数据看板
              </Link>
              
              {/* 当前角色显示 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">当前角色：</span>
                <div className="flex items-center space-x-1">
                  {currentRoleInfo && (
                    <>
                      <div className={`${currentRoleInfo.color} p-1 rounded-full`}>
                        <currentRoleInfo.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{currentRoleInfo.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">活动广场</h1>
              <p className="text-gray-600">五育活动展示</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* 创建活动按钮 - 教师、组长和校长可见 */}
              {(currentRole === 'TEACHER' || currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
                <button 
                  onClick={() => setShowTemplateModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  创建活动
                </button>
              )}
              {/* 创建计划按钮 - 仅组长和校长可见 */}
              {(currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
                <Link 
                  href="/plans/create" 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  创建计划
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索活动..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">所有分类</option>
                {Object.entries(categoryMap).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* 状态筛选 */}
            <div className="lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">所有状态</option>
                {Object.entries(statusMap).map(([key, status]) => (
                  <option key={key} value={key}>{status.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 活动列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const primaryCategory = activity.categories?.[0]
            const category = categoryMap[primaryCategory as keyof typeof categoryMap]
            const status = statusMap[activity.status as keyof typeof statusMap]
            const CategoryIcon = category.icon

            return (
              <Link 
                key={activity.id} 
                href={`/activities/${activity.id}`} 
                onClick={() => setLastPage('/activities')}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer">
                {/* 活动封面图 */}
                <div 
                  className="aspect-[21/9] relative bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${activity.coverImage})`,
                    backgroundPosition: 'center center'
                  }}
                >
                  {/* 蒙版 */}
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  {/* 分类标识 - 左上角 */}
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {(() => {
                      // 定义德智体美劳的顺序
                      const categoryOrder = ['MORAL_EDUCATION', 'ACADEMIC_LEVEL', 'PHYSICAL_HEALTH', 'ARTISTIC_LITERACY', 'SOCIAL_PRACTICE']
                      
                      // 按照德智体美劳的顺序过滤和排序
                      const sortedCategories = categoryOrder.filter(cat => 
                        activity.categories?.includes(cat)
                      )
                      
                      return sortedCategories.map((cat, index) => {
                        const catInfo = categoryMap[cat as keyof typeof categoryMap]
                        return (
                          <div 
                            key={index}
                            className={`${catInfo.color} w-8 h-8 rounded-full flex items-center justify-center shadow-lg`}
                          >
                            <span className="text-white text-sm font-bold">{catInfo.short}</span>
                          </div>
                        )
                      })
                    })()}
                  </div>
                  
                  {/* 状态标签 - 右上角 */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} bg-white bg-opacity-90`}>
                      {status.name}
                    </span>
                  </div>
                </div>

                {/* 活动名称 */}
                <div className="p-4 pb-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {activity.title}
                  </h3>
                </div>

                {/* 活动信息 */}
                <div className="px-4 pb-4">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>

                  {/* 活动信息 */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{activity.startDate} - {activity.endDate}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{activity.participants}/{activity.maxParticipants} 人参与</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>创建者：{activity.creator}</span>
                    </div>
                  </div>
                </div>

                {/* 活动底部 */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      {activity.categories?.map((cat, index) => {
                        const catInfo = categoryMap[cat as keyof typeof categoryMap]
                        return (
                          <span key={index} className="text-sm text-gray-500">
                            {catInfo.name}
                            {index < (activity.categories?.length || 0) - 1 && <span className="mx-1">+</span>}
                          </span>
                        )
                      })}
                    </div>
                    <div className="flex space-x-2">
                      {currentRole === 'STUDENT' && (
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                          参与活动
                        </button>
                      )}
                      {currentRole === 'TEACHER' && (
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                          参与活动
                        </button>
                      )}
                      {currentRole === 'GROUP_LEADER' && (
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                          管理活动
                        </button>
                      )}
                      {currentRole === 'PRINCIPAL' && (
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                          查看详情
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 空状态 */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动</h3>
            <p className="text-gray-500">没有找到符合条件的活动，请尝试调整筛选条件</p>
          </div>
        )}
      </div>


      {/* 悬浮角色切换面板 - 测试用 */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">测试角色切换</h3>
            <div className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
              测试功能
            </div>
          </div>
          <div className="space-y-2">
            {roles.map((role) => {
              const IconComponent = role.icon
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    console.log('Switching role to:', role.id)
                    setCurrentRole(role.id as 'STUDENT' | 'TEACHER' | 'GROUP_LEADER' | 'PRINCIPAL')
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentRole === role.id
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`${role.color} p-1 rounded-full`}>
                    <IconComponent className="h-3 w-3 text-white" />
                  </div>
                  <span>{role.name}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              当前：{currentRoleInfo?.name}
            </p>
          </div>
        </div>
      </div>

      {/* 模板选择模态框 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">选择活动模板</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* 类别筛选 */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTemplateCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      templateCategory === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    全部模板
                  </button>
                  {Object.entries(categoryMap).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setTemplateCategory(key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                        templateCategory === key
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

              {/* 从空白开始选项 */}
              <div className="mb-6">
                <button
                  onClick={() => handleTemplateSelect(null)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">从空白开始创建</h3>
                      <p className="text-gray-600">不使用模板，从头开始创建活动</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* 模板列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={template.coverImage}
                          alt={template.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/activities/default.png'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
                        
                        {/* 类别标识 */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.categories.map((categoryKey) => {
                            const category = categoryMap[categoryKey as keyof typeof categoryMap]
                            if (!category) return null
                            return (
                              <div
                                key={categoryKey}
                                className={`w-6 h-6 rounded-full ${category.color} flex items-center justify-center text-white text-xs font-bold`}
                                title={category.name}
                              >
                                {category.short}
                              </div>
                            )
                          })}
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleTemplatePreview(template)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>预览</span>
                          </button>
                          <button
                            onClick={() => handleTemplateSelect(template.id)}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>使用模板</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 空状态 */}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
                  <p className="text-gray-600">当前类别下没有可用的活动模板</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                <X className="h-6 w-6" />
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
                    
                    {/* 类别标识 */}
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

              {/* 活动流程预览 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">活动流程</h4>
                <div className="space-y-3">
                  {previewTemplate.templateData.processSteps.map((step: any, index: number) => {
                    const stepType = processStepTypes.find(t => t.id === step.type)
                    const Icon = stepType?.icon || FileText
                    const color = stepType?.color || 'bg-gray-500'
                    
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
                              {stepType?.name || step.type}
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
