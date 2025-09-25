'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, Settings, List, Users, Award, FileText, Play, ClipboardList, Target, Plus, Trash2, Edit, GripVertical, CheckCircle } from 'lucide-react'
import { useRole } from '../../../../contexts/RoleContext'
import { categoryMap, statusMap, getActivityPlansForSelection, observationPoints, getObservationPointsByCategory, updateActivity, getActivityById } from '../../../../lib/mockData'

// 主要步骤
const mainSteps = [
  { id: 'basic-settings', name: '基础设置', icon: Settings },
  { id: 'activity-process', name: '活动流程', icon: List },
  { id: 'participants', name: '参与人员', icon: Users }
]

// 基础设置的子步骤
const basicSettingsSections = [
  { id: 'basic-info', name: '基础信息', icon: Settings },
  { id: 'registration', name: '报名设置', icon: Users },
  { id: 'evaluation', name: '综评设置', icon: Award }
]

// 活动流程的子步骤
const processSections = [
  { id: 'process-overview', name: '流程概览', icon: List }
]

// 参与人员的子步骤
const participantSections = [
  { id: 'participant-overview', name: '参与概览', icon: Users }
]

// 流程环节类型
const processStepTypes = [
  { 
    id: 'content', 
    name: '图文', 
    icon: FileText, 
    description: '创建图文内容，支持富文本和图片',
    color: 'bg-blue-500'
  },
  { 
    id: 'checkin', 
    name: '签到', 
    icon: UserCheck, 
    description: '参与者需要点击签到按钮进行签到',
    color: 'bg-green-500'
  },
  { 
    id: 'video', 
    name: '视频', 
    icon: Play, 
    description: '上传视频文件，参与者需要观看学习',
    color: 'bg-purple-500'
  },
  { 
    id: 'questionnaire', 
    name: '问卷', 
    icon: ClipboardList, 
    description: '创建问卷，支持单选、多选、填空题',
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

export default function EditActivityPage() {
  const params = useParams()
  const router = useRouter()
  const { currentRole, setCurrentRole } = useRole()
  const [currentMainStep, setCurrentMainStep] = useState('basic-settings')
  const [activeSection, setActiveSection] = useState('basic-info')
  const [selectedSemester, setSelectedSemester] = useState('2024-2025-2')
  const [showAddStepModal, setShowAddStepModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingStep, setEditingStep] = useState<any>(null)
  const [showStepPreview, setShowStepPreview] = useState<any>(null)
  const [stepEditData, setStepEditData] = useState({
    title: '',
    content: '',
    images: [] as File[],
    checkinDescription: '',
    videoFile: null as File | null,
    videoDescription: '',
    questionnaireTitle: '',
    questionnaireDescription: '',
    questions: [] as Array<{
      id: string,
      type: 'single' | 'multiple' | 'text',
      title: string,
      options: string[],
      placeholder: string
    }>,
    taskTitle: '',
    taskType: 'video' as 'video' | 'audio' | 'text' | 'document',
    taskRequirements: '',
    taskImages: [] as File[]
  })
  const [formData, setFormData] = useState({
    // 基础信息
    title: '',
    description: '',
    organizer: '广州华颖外国语学校',
    grades: [] as string[],
    classes: [] as string[],
    categories: [] as string[],
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: new Date().toTimeString().slice(0, 5),
    endTime: new Date().toTimeString().slice(0, 5),
    maxParticipants: 100,
    responsibleTeacher: '',
    activityPlan: null as File | null,
    coverImage: null as File | null,
    
    // 报名设置
    requireRegistration: false,
    observationPoints: [] as string[],
    
    // 活动流程
    processSteps: [] as Array<{
      id: string,
      type: 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
      title: string,
      order: number,
      data: any
    }>,
    
    // 综评设置
    selectedPlans: [] as Array<{planId: string, planName: string, direction: string}>
  })

  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: UserCheck, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)
  const canCreateActivity = ['TEACHER', 'GROUP_LEADER', 'PRINCIPAL'].includes(currentRole)

  // 加载活动数据
  useEffect(() => {
    const activityId = params.id as string
    const activity = getActivityById(activityId)
    
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description,
        organizer: '广州华颖外国语学校',
        grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
        classes: [],
        categories: activity.categories,
        location: activity.location,
        startDate: activity.startDate,
        endDate: activity.endDate,
        startTime: '08:00',
        endTime: '18:00',
        maxParticipants: activity.maxParticipants,
        responsibleTeacher: activity.creator,
        activityPlan: null,
        coverImage: null,
        requireRegistration: false,
        observationPoints: [],
        processSteps: [],
        selectedPlans: []
      })
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 准备活动数据
      const activityData = {
        title: formData.title,
        description: formData.description,
        categories: formData.categories,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        maxParticipants: formData.maxParticipants,
        responsibleTeacher: formData.responsibleTeacher,
        activityDirection: formData.selectedPlans.length > 0 ? formData.selectedPlans[0].direction : '',
        activityPlan: formData.selectedPlans.length > 0 ? formData.selectedPlans[0].planName : '',
        coverImage: formData.coverImage ? URL.createObjectURL(formData.coverImage) : '/images/activities/default.png'
      }
      
      // 更新活动数据
      const success = updateActivity(params.id as string, activityData)
      
      if (success) {
        console.log('活动更新成功:', activityData)
        
        // 显示成功提示
        setShowSuccess(true)
        
        // 2秒后跳转到活动广场页面
        setTimeout(() => {
          router.push('/activities')
        }, 2000)
      } else {
        console.error('活动更新失败')
        alert('活动更新失败，请重试')
      }
      
    } catch (error) {
      console.error('更新活动失败:', error)
      alert('更新活动失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 获取当前主要步骤的子步骤
  const getCurrentSubSections = () => {
    switch (currentMainStep) {
      case 'basic-settings':
        return basicSettingsSections
      case 'activity-process':
        return processSections
      case 'participants':
        return participantSections
      default:
        return basicSettingsSections
    }
  }

  // 处理主要步骤切换
  const handleMainStepChange = (stepId: string) => {
    setCurrentMainStep(stepId)
    // 切换到对应步骤的第一个子步骤
    const subSections = getCurrentSubSections()
    if (subSections.length > 0) {
      setActiveSection(subSections[0].id)
    }
  }

  if (!canCreateActivity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">权限不足</h1>
          <p className="text-gray-600 mb-4">只有教师、教师组长和校长可以编辑活动</p>
          <Link 
            href="/activities"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
          >
            返回活动广场
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 成功提示模态框 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">活动更新成功！</h3>
            <p className="text-gray-600 mb-4">活动已成功更新，即将跳转到活动广场...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/activities" className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700">返回活动广场</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">当前角色：{currentRoleInfo?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">编辑活动</h1>
          <p className="text-gray-600">修改活动信息，更新活动详情和参与规则</p>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-gray-700">添加到学期：</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="2024-2025-1">2024-2025学年上学期</option>
              <option value="2024-2025-2">2024-2025学年下学期</option>
            </select>
          </div>
        </div>

        {/* 主要步骤导航 */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {mainSteps.map((step) => {
              const Icon = step.icon
              const isActive = currentMainStep === step.id
              return (
                <button
                  key={step.id}
                  onClick={() => handleMainStepChange(step.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="font-medium">{step.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">设置步骤</h2>
              <nav className="space-y-2">
                {getCurrentSubSections().map((section) => {
                  const IconComponent = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{section.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* 右侧表单内容 */}
          <div className="lg:col-span-3">
            {/* 基础设置表单 */}
            {currentMainStep === 'basic-settings' && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 基础信息 */}
                <div id="basic-info" className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">基础信息</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        活动名称 *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入活动名称"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        主办单位
                      </label>
                      <input
                        type="text"
                        value={formData.organizer}
                        onChange={(e) => updateFormData('organizer', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        活动描述 *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请描述活动的内容、目的和意义"
                        required
                      />
                    </div>

                    {/* 其他基础信息字段... */}
                  </div>
                </div>

                {/* 提交按钮 */}
                <div className="flex justify-end space-x-4">
                  <Link
                    href="/activities"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    取消
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        更新中...
                      </>
                    ) : (
                      '更新活动'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* 活动流程表单 */}
            {currentMainStep === 'activity-process' && (
              <div className="space-y-8">
                <div id="process-overview" className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">流程概览</h2>
                    <button
                      type="button"
                      onClick={() => setShowAddStepModal(true)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加环节
                    </button>
                  </div>
                  
                  {formData.processSteps.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <List className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动环节</h3>
                      <p className="text-gray-600 mb-4">点击"添加环节"开始创建活动流程</p>
                      <button
                        type="button"
                        onClick={() => setShowAddStepModal(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        添加第一个环节
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.processSteps
                        .sort((a, b) => a.order - b.order)
                        .map((step, index) => {
                          const stepType = processStepTypes.find(t => t.id === step.type)
                          const Icon = stepType?.icon || FileText
                          return (
                            <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div 
                                  className="flex items-center space-x-4 flex-1 cursor-pointer"
                                  onClick={() => {
                                    if (step.type === 'content' || step.type === 'questionnaire' || step.type === 'task') {
                                      setShowStepPreview(step)
                                    }
                                  }}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {index + 1}
                                    </span>
                                    <div className={`${stepType?.color} p-2 rounded-lg`}>
                                      <Icon className="h-4 w-4 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                                    <p className="text-sm text-gray-500">{stepType?.name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingStep(step)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        processSteps: prev.processSteps.filter(s => s.id !== step.id)
                                      }))
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 参与人员表单 */}
            {currentMainStep === 'participants' && (
              <div className="space-y-8">
                <div id="participant-overview" className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">参与概览</h2>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">参与人员管理</h3>
                    <p className="text-gray-600">参与人员管理功能正在开发中...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
