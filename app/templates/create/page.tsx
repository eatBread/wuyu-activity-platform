'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, Settings, List, Users, Award, FileText, Play, ClipboardList, Target, Plus, Trash2, Edit, GripVertical, CheckCircle, Eye } from 'lucide-react'
import { useRole } from '../../../contexts/RoleContext'
import { useRouter } from 'next/navigation'
import { categoryMap, statusMap, getActivityPlansForSelection, observationPoints, getObservationPointsByCategory } from '../../../lib/mockData'

// 主要步骤
const mainSteps = [
  { id: 'basic-settings', name: '基础设置', icon: Settings },
  { id: 'template-process', name: '模板流程', icon: List },
  { id: 'preview', name: '预览确认', icon: Award }
]

// 基础设置的子步骤
const basicSettingsSections = [
  { id: 'basic-info', name: '基础信息', icon: Settings },
  { id: 'registration', name: '报名设置', icon: Users },
  { id: 'evaluation', name: '综评设置', icon: Award }
]

// 模板流程的子步骤
const processSections = [
  { id: 'process-overview', name: '流程概览', icon: List },
  { id: 'process-details', name: '详细流程', icon: FileText }
]

// 预览的子步骤
const previewSections = [
  { id: 'template-preview', name: '模板预览', icon: Eye },
  { id: 'final-check', name: '最终确认', icon: CheckCircle }
]

// 流程环节类型定义
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

// 包装组件处理 useSearchParams
function CreateTemplateContent() {
  const { currentRole, setCurrentRole } = useRole()
  const router = useRouter()
  const [currentMainStep, setCurrentMainStep] = useState('basic-settings')
  const [activeSection, setActiveSection] = useState('basic-info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingStep, setEditingStep] = useState<any>(null)
  const [showStepPreview, setShowStepPreview] = useState<any>(null)
  const [showAddStepModal, setShowAddStepModal] = useState(false)
  const [stepEditData, setStepEditData] = useState({
    title: '',
    content: '',
    images: [] as File[],
    // 签到环节数据
    checkinDescription: '',
    // 视频环节数据
    videoFile: null as File | null,
    videoDescription: '',
    // 问卷环节数据
    questionnaireTitle: '',
    questionnaireDescription: '',
    questions: [] as Array<{
      id: string,
      type: 'single' | 'multiple' | 'text',
      title: string,
      options: string[],
      placeholder: string
    }>,
    // 任务环节数据
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
    coverImage: null as File | null,
    
    // 报名设置
    requireRegistration: false,
    
    // 综评设置
    observationPoints: [] as string[],
    
    // 模板流程
    processSteps: [] as Array<{
      id: string,
      type: 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
      title: string,
      order: number,
      data: any
    }>
  })

  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: UserCheck, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)
  const canCreateTemplate = ['TEACHER', 'GROUP_LEADER', 'PRINCIPAL'].includes(currentRole)

  // 权限检查
  if (!canCreateTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <BookOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">权限不足</h3>
          <p className="text-gray-600 mb-4">只有教师、组长和校长可以创建模板</p>
          <Link 
            href="/templates"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            返回模板中心
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 准备模板数据
      const templateData = {
        name: formData.title,
        description: formData.description,
        categories: formData.categories,
        coverImage: formData.coverImage ? URL.createObjectURL(formData.coverImage) : '/images/activities/default.png',
        observationPoints: formData.observationPoints,
        processSteps: formData.processSteps
      }
      
      console.log('创建模板数据:', templateData)
      
      // 显示成功状态
      setShowSuccess(true)
      
      // 2秒后跳转
      setTimeout(() => {
        router.push('/templates')
      }, 2000)
      
    } catch (error) {
      console.error('创建模板失败:', error)
      alert('创建模板失败，请重试')
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

  // 添加流程步骤
  const addProcessStep = (type: string) => {
    const newStep = {
      id: `step_${Date.now()}`,
      type: type as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
      title: `新${processStepTypes.find(t => t.id === type)?.name || '环节'}`,
      order: formData.processSteps.length,
      data: getDefaultStepData(type)
    }
    
    setShowAddStepModal(false)
    
    // 先添加到流程中
    updateFormData('processSteps', [...formData.processSteps, newStep])
    
    // 如果是图文、签到、视频、问卷或任务类型，进入编辑模式
    if (type === 'content' || type === 'checkin' || type === 'video' || type === 'questionnaire' || type === 'task') {
      setEditingStep(newStep)
    }
  }

  const getDefaultStepData = (type: string) => {
    switch (type) {
      case 'content':
        return { content: '', images: [] }
      case 'checkin':
        return { description: '' }
      case 'video':
        return { videoFile: null, description: '' }
      case 'questionnaire':
        return { 
          title: '', 
          description: '',
          questions: [
            {
              id: `q_${Date.now()}`,
              type: 'single',
              title: '请选择您的答案',
              options: ['选项1', '选项2'],
              placeholder: ''
            }
          ]
        }
      case 'task':
        return { 
          title: '', 
          type: 'video', 
          requirements: '描述任务要求，任务要求将展示在学员界面',
          images: [] 
        }
      default:
        return {}
    }
  }

  // 移动流程步骤
  const moveProcessStep = (stepId: string, direction: 'up' | 'down') => {
    const steps = [...formData.processSteps]
    const currentIndex = steps.findIndex(step => step.id === stepId)
    
    if (direction === 'up' && currentIndex > 0) {
      [steps[currentIndex], steps[currentIndex - 1]] = [steps[currentIndex - 1], steps[currentIndex]]
      // 更新order
      steps.forEach((step, index) => {
        step.order = index
      })
      updateFormData('processSteps', steps)
    } else if (direction === 'down' && currentIndex < steps.length - 1) {
      [steps[currentIndex], steps[currentIndex + 1]] = [steps[currentIndex + 1], steps[currentIndex]]
      // 更新order
      steps.forEach((step, index) => {
        step.order = index
      })
      updateFormData('processSteps', steps)
    }
  }

  // 删除流程步骤
  const deleteProcessStep = (stepId: string) => {
    const newSteps = formData.processSteps.filter(step => step.id !== stepId)
    // 重新排序
    newSteps.forEach((step, index) => {
      step.order = index
    })
    updateFormData('processSteps', newSteps)
  }

  // 更新流程步骤
  const updateProcessStep = (stepId: string, updates: any) => {
    const newSteps = formData.processSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    )
    updateFormData('processSteps', newSteps)
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 获取当前步骤的子步骤
  const getCurrentSubSections = () => {
    switch (currentMainStep) {
      case 'basic-settings':
        return basicSettingsSections
      case 'template-process':
        return processSections
      case 'preview':
        return previewSections
      default:
        return []
    }
  }

  // 监听滚动位置，自动更新激活的导航项
  useEffect(() => {
    const handleScroll = () => {
      const sections = getCurrentSubSections().map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      })).filter(section => section.element)

      const scrollPosition = window.scrollY + 200 // 偏移量，提前切换

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentMainStep])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/templates" className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700">返回模板中心</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建活动模板</h1>
          <p className="text-gray-600">创建新的活动模板，供其他用户使用</p>
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
                  onClick={() => setCurrentMainStep(step.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="font-medium">{step.name}</span>
                </button>
              )
            })}
          </div>
          
          {/* 步骤导航按钮 */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                const currentIndex = mainSteps.findIndex(step => step.id === currentMainStep)
                if (currentIndex > 0) {
                  setCurrentMainStep(mainSteps[currentIndex - 1].id)
                }
              }}
              disabled={currentMainStep === 'basic-settings'}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                currentMainStep === 'basic-settings'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              上一步
            </button>
            
            <div className="flex space-x-2">
              {mainSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full ${
                    mainSteps.findIndex(s => s.id === currentMainStep) >= index
                      ? 'bg-primary-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => {
                const currentIndex = mainSteps.findIndex(step => step.id === currentMainStep)
                if (currentIndex < mainSteps.length - 1) {
                  setCurrentMainStep(mainSteps[currentIndex + 1].id)
                }
              }}
              disabled={currentMainStep === 'preview'}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                currentMainStep === 'preview'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              下一步
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <form onSubmit={handleSubmit}>
              {/* 基础设置步骤 */}
              {currentMainStep === 'basic-settings' && (
                <div className="space-y-8">
                  {/* 基础信息 */}
                  <div id="basic-info" className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">基础信息</h2>
                    <div className="space-y-6">
                      {/* 模板名称 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          模板名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => updateFormData('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="请输入模板名称"
                          required
                        />
                      </div>

                      {/* 主办单位 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          主办单位
                        </label>
                        <input
                          type="text"
                          value={formData.organizer}
                          onChange={(e) => updateFormData('organizer', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="请输入主办单位"
                        />
                      </div>

                      {/* 模板描述 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          模板描述 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="请描述模板的内容、目的和意义"
                          required
                        />
                      </div>

                      {/* 模板分类 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          模板分类 <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(categoryMap).map(([key, category]) => (
                            <label key={key} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.categories.includes(key)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateFormData('categories', [...formData.categories, key])
                                  } else {
                                    updateFormData('categories', formData.categories.filter(cat => cat !== key))
                                  }
                                }}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 参与年级 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          参与年级 <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'].map((grade) => {
                            const isSelected = formData.grades.includes(grade)
                            return (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => {
                                  const newGrades = isSelected
                                    ? formData.grades.filter(g => g !== grade)
                                    : [...formData.grades, grade]
                                  updateFormData('grades', newGrades)
                                }}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                  isSelected
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {grade}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* 活动地点 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          活动地点
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => updateFormData('location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="请输入活动地点"
                        />
                      </div>

                      {/* 活动时间 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            开始日期
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => updateFormData('startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            结束日期
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => updateFormData('endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* 活动时间 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            开始时间
                          </label>
                          <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => updateFormData('startTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            结束时间
                          </label>
                          <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => updateFormData('endTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* 最大参与人数 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          最大参与人数
                        </label>
                        <input
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => updateFormData('maxParticipants', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="请输入最大参与人数"
                          min="1"
                        />
                      </div>

                      {/* 负责教师 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          负责教师
                        </label>
                        <input
                          type="text"
                          value={formData.responsibleTeacher}
                          onChange={(e) => updateFormData('responsibleTeacher', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="请输入负责教师姓名"
                        />
                      </div>

                      {/* 模板封面 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          模板封面
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                updateFormData('coverImage', file)
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 报名设置 */}
                  <div id="registration" className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">报名设置</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="requireRegistration"
                          checked={formData.requireRegistration}
                          onChange={(e) => updateFormData('requireRegistration', e.target.checked)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="requireRegistration" className="text-sm font-medium text-gray-700">
                          需要报名参与
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        开启后，学生需要主动报名才能参与此活动
                      </p>
                    </div>
                  </div>

                  {/* 综评设置 */}
                  <div id="evaluation" className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">综评设置</h2>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">选择此模板关联的综合素质评价观测点</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {observationPoints.map((point) => (
                          <label key={point.id} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={formData.observationPoints.includes(point.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateFormData('observationPoints', [...formData.observationPoints, point.id])
                                } else {
                                  updateFormData('observationPoints', formData.observationPoints.filter(id => id !== point.id))
                                }
                              }}
                              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{point.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{point.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 模板流程步骤 */}
              {currentMainStep === 'template-process' && (
                <div className="space-y-8">
                  {/* 流程概览 */}
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
                                      if (step.type === 'content' || step.type === 'checkin' || step.type === 'video' || step.type === 'questionnaire' || step.type === 'task') {
                                        setShowStepPreview(step)
                                      }
                                    }}
                                  >
                                    {/* 顺序数字 */}
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                      {index + 1}
                                    </div>
                                    
                                    {/* 环节类型图标 */}
                                    <div className={`p-2 rounded-lg ${stepType?.color || 'bg-gray-500'}`}>
                                      <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    
                                    {/* 环节信息 */}
                                    <div>
                                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                                      <p className="text-sm text-gray-600">{stepType?.name}</p>
                                      {(step.type === 'content' || step.type === 'checkin' || step.type === 'video' || step.type === 'questionnaire' || step.type === 'task') && (
                                        <p className="text-xs text-gray-500 mt-1">点击预览内容</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* 操作按钮 */}
                                  <div className="flex items-center space-x-1">
                                    {/* 上移按钮 */}
                                    <button
                                      type="button"
                                      onClick={() => moveProcessStep(step.id, 'up')}
                                      disabled={index === 0}
                                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent"
                                      title="上移"
                                    >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                    </button>
                                    
                                    {/* 下移按钮 */}
                                    <button
                                      type="button"
                                      onClick={() => moveProcessStep(step.id, 'down')}
                                      disabled={index === formData.processSteps.length - 1}
                                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent"
                                      title="下移"
                                    >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                    
                                    {/* 编辑按钮 */}
                                    <button
                                      type="button"
                                      onClick={() => setEditingStep(step)}
                                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
                                      title="编辑"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    
                                    {/* 删除按钮 */}
                                    <button
                                      type="button"
                                      onClick={() => deleteProcessStep(step.id)}
                                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                                      title="删除"
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

              {/* 预览确认步骤 */}
              {currentMainStep === 'preview' && (
                <div className="space-y-8">
                  <div id="template-preview" className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">模板预览</h2>
                    <p className="text-gray-600 mb-4">模板预览功能正在开发中...</p>
                  </div>
                </div>
              )}

              {/* 提交按钮 */}
              <div className="mt-8 flex justify-end space-x-4">
                <Link
                  href="/templates"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? '创建中...' : '创建模板'}
                </button>
              </div>
        </form>
      </div>

      {/* 添加环节模态框 */}
      {showAddStepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">添加活动环节</h2>
              <button
                onClick={() => setShowAddStepModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processStepTypes.map((stepType) => {
                  const Icon = stepType.icon
                  return (
                    <button
                      key={stepType.id}
                      onClick={() => addProcessStep(stepType.id)}
                      className={`p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 text-left ${stepType.color}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{stepType.name}</h3>
                          <p className="text-sm text-gray-600">{stepType.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑环节模态框 */}
      {editingStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">编辑环节</h2>
              <button
                onClick={() => setEditingStep(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* 环节标题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    环节标题
                  </label>
                  <input
                    type="text"
                    value={editingStep.title}
                    onChange={(e) => setEditingStep({...editingStep, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入环节标题"
                  />
                </div>

                {/* 根据环节类型显示不同的编辑内容 */}
                {editingStep.type === 'content' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      内容描述
                    </label>
                    <textarea
                      value={editingStep.data?.content || ''}
                      onChange={(e) => setEditingStep({
                        ...editingStep, 
                        data: {...editingStep.data, content: e.target.value}
                      })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入内容描述"
                    />
                  </div>
                )}

                {editingStep.type === 'checkin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      签到说明
                    </label>
                    <textarea
                      value={editingStep.data?.description || ''}
                      onChange={(e) => setEditingStep({
                        ...editingStep, 
                        data: {...editingStep.data, description: e.target.value}
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入签到说明"
                    />
                  </div>
                )}

                {editingStep.type === 'video' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        视频描述
                      </label>
                      <textarea
                        value={editingStep.data?.description || ''}
                        onChange={(e) => setEditingStep({
                          ...editingStep, 
                          data: {...editingStep.data, description: e.target.value}
                        })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入视频描述"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        视频文件
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setEditingStep({
                          ...editingStep, 
                          data: {...editingStep.data, videoFile: e.target.files?.[0] || null}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {editingStep.type === 'questionnaire' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        问卷标题
                      </label>
                      <input
                        type="text"
                        value={editingStep.data?.title || ''}
                        onChange={(e) => setEditingStep({
                          ...editingStep, 
                          data: {...editingStep.data, title: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入问卷标题"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        问卷描述
                      </label>
                      <textarea
                        value={editingStep.data?.description || ''}
                        onChange={(e) => setEditingStep({
                          ...editingStep, 
                          data: {...editingStep.data, description: e.target.value}
                        })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入问卷描述"
                      />
                    </div>
                  </div>
                )}

                {editingStep.type === 'task' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        任务标题
                      </label>
                      <input
                        type="text"
                        value={editingStep.data?.title || ''}
                        onChange={(e) => setEditingStep({
                          ...editingStep, 
                          data: {...editingStep.data, title: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入任务标题"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        任务要求
                      </label>
                      <textarea
                        value={editingStep.data?.requirements || ''}
                        onChange={(e) => setEditingStep({
                          ...editingStep, 
                          data: {...editingStep.data, requirements: e.target.value}
                        })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入任务要求"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setEditingStep(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    // 更新流程步骤
                    updateProcessStep(editingStep.id, editingStep)
                    setEditingStep(null)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-green-500 mb-4">
                <CheckCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">模板创建成功！</h3>
              <p className="text-gray-600">正在跳转到模板中心...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 主组件，使用Suspense包装
export default function CreateTemplatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <CreateTemplateContent />
    </Suspense>
  )
}
