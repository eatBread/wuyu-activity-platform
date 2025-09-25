'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, Settings, List, Users, Award, FileText, Play, ClipboardList, Target, Plus, Trash2, Edit, GripVertical, CheckCircle, Eye, Calendar, User } from 'lucide-react'
import { useRole } from '../../../contexts/RoleContext'
import { useRouter } from 'next/navigation'
import { categoryMap, statusMap, getActivityPlansForSelection, observationPoints, getObservationPointsByCategory, addNewTemplate } from '../../../lib/mockData'

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

// 环节类型图标和颜色映射
const stepTypeIcons = {
  content: FileText,
  checkin: ClipboardList,
  video: Play,
  questionnaire: Target,
  task: FileText
}

const stepTypeColors = {
  content: 'bg-blue-500',
  checkin: 'bg-green-500',
  video: 'bg-purple-500',
  questionnaire: 'bg-orange-500',
  task: 'bg-red-500'
}

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
      // 验证必填字段
      if (!formData.title.trim()) {
        alert('请输入模板名称')
        return
      }
      
      if (formData.categories.length === 0) {
        alert('请选择至少一个类别')
        return
      }
      
      // 处理封面图片
      let coverImageUrl = '/images/activities/default.png'
      if (formData.coverImage) {
        // 在实际应用中，这里应该上传到服务器并获取URL
        // 现在使用默认图片，避免URL.createObjectURL在页面刷新后失效
        coverImageUrl = '/images/activities/default.png'
      }
      
      // 准备完整的模板数据
      const templateData = {
        name: formData.title.trim(),
        description: formData.description.trim() || '暂无描述',
        categories: formData.categories,
        coverImage: coverImageUrl,
        createdBy: 'user', // 当前用户
        templateData: {
          title: formData.title.trim(),
          description: formData.description.trim() || '暂无描述',
          organizer: formData.organizer,
          grades: formData.grades,
          classes: formData.classes,
          categories: formData.categories,
          location: formData.location,
          startDate: formData.startDate,
          endDate: formData.endDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          maxParticipants: formData.maxParticipants,
          responsibleTeacher: formData.responsibleTeacher,
          requireRegistration: formData.requireRegistration,
          observationPoints: formData.observationPoints,
          processSteps: formData.processSteps.map((step, index) => ({
            ...step,
            order: index // 确保顺序正确
          })),
          selectedPlans: [] // 模板不包含活动方案
        }
      }
      
      console.log('创建模板数据:', templateData)
      
      // 保存模板
      const newTemplate = addNewTemplate(templateData)
      
      console.log('模板创建成功:', newTemplate)
      
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
    let stepTitle = `新建${processStepTypes.find(t => t.id === type)?.name || '环节'}`
    
    // 为签到环节设置默认名称
    if (type === 'checkin') {
      if (formData.title && formData.title.trim()) {
        stepTitle = `${formData.title}签到`
      } else {
        stepTitle = '活动签到'
      }
    }

    const newStep = {
      id: `step_${Date.now()}`,
      type: type as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
      title: stepTitle,
      order: formData.processSteps.length,
      data: getDefaultStepData(type)
    }

    setShowAddStepModal(false)
    
    // 如果是图文、签到、视频、问卷或任务类型，进入编辑模式（不添加到流程中）
    if (type === 'content' || type === 'checkin' || type === 'video' || type === 'questionnaire' || type === 'task') {
      setEditingStep(newStep)
      // 设置编辑数据
      setStepEditData(prev => ({
        ...prev,
        title: newStep.title,
        ...newStep.data
      }))
    } else {
      // 其他类型直接添加到流程中
      updateFormData('processSteps', [...formData.processSteps, newStep])
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
              type: 'single' as 'single' | 'multiple' | 'text',
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

  // 取消步骤编辑
  const cancelStepEdit = () => {
    setEditingStep(null)
    setStepEditData({
      title: '',
      content: '',
      images: [],
      checkinDescription: '',
      videoFile: null,
      videoDescription: '',
      questionnaireTitle: '',
      questionnaireDescription: '',
      questions: [],
      taskTitle: '',
      taskType: 'video' as 'video' | 'audio' | 'text' | 'document',
      taskRequirements: '',
      taskImages: []
    })
  }

  // 保存步骤编辑
  const saveStepEdit = () => {
    if (!editingStep) return

    let updatedData = { ...editingStep.data }
    
    if (editingStep.type === 'content') {
      updatedData = {
        ...updatedData,
        content: stepEditData.content,
        images: stepEditData.images
      }
    } else if (editingStep.type === 'checkin') {
      updatedData = {
        ...updatedData,
        description: stepEditData.checkinDescription
      }
    } else if (editingStep.type === 'video') {
      updatedData = {
        ...updatedData,
        videoFile: stepEditData.videoFile,
        description: stepEditData.videoDescription
      }
    } else if (editingStep.type === 'questionnaire') {
      updatedData = {
        ...updatedData,
        title: stepEditData.questionnaireTitle,
        description: stepEditData.questionnaireDescription,
        questions: stepEditData.questions
      }
    } else if (editingStep.type === 'task') {
      updatedData = {
        ...updatedData,
        title: stepEditData.taskTitle,
        type: stepEditData.taskType,
        requirements: stepEditData.taskRequirements,
        images: stepEditData.taskImages
      }
    }
    
    // 检查环节是否已经在流程中
    const existingStepIndex = formData.processSteps.findIndex(step => step.id === editingStep.id)
    
    if (existingStepIndex >= 0) {
      // 如果已存在，更新环节
      updateProcessStep(editingStep.id, {
        title: stepEditData.title,
        data: updatedData
      })
    } else {
      // 如果不存在，添加到流程中
      const newStep = {
        ...editingStep,
        title: stepEditData.title,
        data: updatedData,
        order: formData.processSteps.length
      }
      updateFormData('processSteps', [...formData.processSteps, newStep])
    }
    
    setEditingStep(null)
    setStepEditData({
      title: '',
      content: '',
      images: [],
      checkinDescription: '',
      videoFile: null,
      videoDescription: '',
      questionnaireTitle: '',
      questionnaireDescription: '',
      questions: [],
      taskTitle: '',
      taskType: 'video' as 'video' | 'audio' | 'text' | 'document',
      taskRequirements: '',
      taskImages: []
    })
  }

  // 处理视频上传
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setStepEditData(prev => ({ ...prev, videoFile: file }))
    }
  }

  // 移除视频
  const removeVideo = () => {
    setStepEditData(prev => ({ ...prev, videoFile: null }))
  }

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setStepEditData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...files]
      }))
    }
  }

  // 移除图片
  const removeImage = (index: number) => {
    setStepEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // 问卷题目管理函数
  const addQuestion = () => {
    const newQuestion = {
      id: `question_${Date.now()}`,
      type: 'single' as 'single' | 'multiple' | 'text',
      title: '',
      options: ['选项1', '选项2'],
      placeholder: ''
    }
    setStepEditData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }))
  }

  const deleteQuestion = (questionId: string) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const updateQuestion = (questionId: string, updates: any) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }))
  }

  const addOption = (questionId: string) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: [...q.options, `选项${q.options.length + 1}`] }
          : q
      )
    }))
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    }))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map((opt, i) => i === optionIndex ? value : opt)
            }
          : q
      )
    }))
  }

  // 任务图片管理函数
  const handleTaskImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setStepEditData(prev => ({ 
        ...prev, 
        taskImages: [...prev.taskImages, ...files]
      }))
    }
  }

  const removeTaskImage = (index: number) => {
    setStepEditData(prev => ({
      ...prev,
      taskImages: prev.taskImages.filter((_, i) => i !== index)
    }))
  }

  // 环节编辑函数
  const startEditingStep = (step: any) => {
    setEditingStep(step)
    
    // 如果是签到环节且名称为默认值，则使用活动名称+签到
    let stepTitle = step.title
    if (step.type === 'checkin' && (step.title === '新建签到' || step.title === '活动签到')) {
      if (formData.title && formData.title.trim()) {
        stepTitle = `${formData.title}签到`
      } else {
        stepTitle = '活动签到'
      }
    }
    
    setStepEditData({
      title: stepTitle,
      content: step.data?.content || '',
      images: step.data?.images || [],
      checkinDescription: step.data?.description || '',
      videoFile: step.data?.videoFile || null,
      videoDescription: step.data?.description || '',
      questionnaireTitle: step.data?.title || '',
      questionnaireDescription: step.data?.description || '',
      questions: step.data?.questions || [],
      taskTitle: step.data?.title || '',
      taskType: step.data?.type || 'video',
      taskRequirements: step.data?.requirements || '',
      taskImages: step.data?.images || []
    })
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
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        moveProcessStep(step.id, 'up')
                                      }}
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
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        moveProcessStep(step.id, 'down')
                                      }}
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
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        startEditingStep(step)
                                      }}
                                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
                                      title="编辑"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    
                                    {/* 删除按钮 */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteProcessStep(step.id)
                                      }}
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
                    
                    {/* 模板基本信息预览 */}
                    <div className="mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {formData.coverImage ? (
                            <img
                              src={URL.createObjectURL(formData.coverImage)}
                              alt="模板封面"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FileText className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.title || '未设置标题'}</h3>
                          <p className="text-gray-600 mb-4">{formData.description || '未设置描述'}</p>

                          {/* 类别标签 */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.categories.map((categoryKey) => {
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
                              <span>{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>用户创建</span>
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
                            <p className="text-gray-900">{formData.title || '未设置'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">活动地点</label>
                            <p className="text-gray-900">{formData.location || '未设置'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">活动时间</label>
                            <p className="text-gray-900">
                              {formData.startDate} {formData.startTime} - {formData.endTime}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">最大参与人数</label>
                            <p className="text-gray-900">{formData.maxParticipants}人</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700">活动描述</label>
                          <p className="text-gray-900 mt-1">{formData.description || '未设置'}</p>
                        </div>
                      </div>
                    </div>

                    {/* 活动流程预览 */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">活动流程</h4>
                      {formData.processSteps.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">暂无流程步骤</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formData.processSteps
                            .sort((a, b) => a.order - b.order)
                            .map((step, index) => {
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
                                        {processStepTypes.find(t => t.id === step.type)?.name || step.type}
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
                      )}
                    </div>
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

      {/* 签到环节编辑模态框 */}
      {editingStep && editingStep.type === 'checkin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">编辑签到环节</h3>
                <button
                  onClick={cancelStepEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 签到名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    签到名称
                  </label>
                  <input
                    type="text"
                    value={stepEditData.title}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入签到名称"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    默认：{formData.title && formData.title.trim() ? `${formData.title}签到` : '活动签到'}
                  </p>
                </div>

                {/* 签到说明 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    签到说明
                  </label>
                  <textarea
                    value={stepEditData.checkinDescription}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, checkinDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入签到说明，如签到时间、地点、注意事项等"
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelStepEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveStepEdit}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 视频环节编辑模态框 */}
      {editingStep && editingStep.type === 'video' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">编辑视频环节</h3>
                <button
                  onClick={cancelStepEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 视频名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stepEditData.title}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入视频名称"
                    required
                  />
                </div>

                {/* 上传视频 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    上传视频 <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">点击上传视频文件</span>
                      <span className="text-xs text-gray-500 mt-1">支持 MP4, AVI, MOV 等格式</span>
                    </label>
                  </div>
                  
                  {/* 已上传的视频 */}
                  {stepEditData.videoFile && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{stepEditData.videoFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(stepEditData.videoFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 视频说明 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频说明
                  </label>
                  <textarea
                    value={stepEditData.videoDescription}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, videoDescription: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入视频说明，如学习目标、重点内容等"
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelStepEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveStepEdit}
                  disabled={!stepEditData.title || !stepEditData.videoFile}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 图文环节编辑模态框 */}
      {editingStep && editingStep.type === 'content' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">编辑图文环节</h3>
                <button
                  onClick={cancelStepEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 环节名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    环节名称
                  </label>
                  <input
                    type="text"
                    value={stepEditData.title}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入环节名称"
                  />
                </div>

                {/* 富文本编辑器 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    环节内容
                  </label>
                  <div className="border border-gray-300 rounded-md">
                    {/* 工具栏 */}
                    <div className="border-b border-gray-200 p-2 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                          title="粗体"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h5.5a2.5 2.5 0 010 5H6a1 1 0 000 2h4.5a2.5 2.5 0 010 5H6a1 1 0 01-1-1V4zm2 1v2h3.5a.5.5 0 000-1H7zm0 4v2h4.5a.5.5 0 000-1H7z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                          title="斜体"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 3a1 1 0 000 2h1.5l-2 8H6a1 1 0 100 2h4a1 1 0 100-2h-1.5l2-8H12a1 1 0 100-2H8z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                          title="下划线"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h6a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9.586 10l-3.707-3.707a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                          title="插入图片"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* 编辑区域 */}
                    <textarea
                      value={stepEditData.content}
                      onChange={(e) => setStepEditData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full h-64 p-4 border-0 focus:ring-0 resize-none text-gray-900"
                      placeholder="请输入环节内容..."
                    />
                  </div>
                </div>

                {/* 图片上传 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    上传图片
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm text-gray-600">点击上传图片</span>
                    </label>
                  </div>
                  
                  {/* 已上传的图片 */}
                  {stepEditData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">已上传的图片</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stepEditData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`上传图片 ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelStepEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveStepEdit}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 问卷环节编辑模态框 */}
      {editingStep && editingStep.type === 'questionnaire' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">编辑问卷环节</h3>
                <button
                  onClick={cancelStepEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 问卷名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    问卷名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stepEditData.title}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入问卷名称"
                    required
                  />
                </div>

                {/* 问卷说明 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    问卷说明
                  </label>
                  <textarea
                    value={stepEditData.questionnaireDescription}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, questionnaireDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入问卷说明，如调查目的、填写要求等"
                  />
                </div>

                {/* 问题列表 */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">问卷题目</h4>
                      <p className="text-sm text-gray-500">当前共有 {stepEditData.questions?.length || 0} 道题目</p>
                    </div>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>添加题目</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {stepEditData.questions && stepEditData.questions.length > 0 ? (
                      stepEditData.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        {/* 题目头部 */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-lg font-medium text-gray-900">第{index + 1}题</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteQuestion(question.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                            title="删除题目"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* 题目类型和内容 */}
                        <div className="space-y-4">
                          {/* 题目类型选择 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">题目类型</label>
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="single">单选题</option>
                              <option value="multiple">多选题</option>
                              <option value="text">填空题</option>
                            </select>
                          </div>

                          {/* 题目内容 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">题目内容</label>
                            <input
                              type="text"
                              value={question.title}
                              onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="请输入题目内容"
                            />
                          </div>
                        </div>

                        {/* 选项编辑区域 */}
                        {(question.type === 'single' || question.type === 'multiple') && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-sm font-medium text-gray-700">选项设置</label>
                              <button
                                type="button"
                                onClick={() => addOption(question.id)}
                                className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>添加选项</span>
                              </button>
                            </div>
                            <div className="space-y-3">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                    <input
                                      type={question.type === 'single' ? 'radio' : 'checkbox'}
                                      disabled
                                      className="text-orange-600"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder={`选项 ${optionIndex + 1}`}
                                  />
                                  {question.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeOption(question.id, optionIndex)}
                                      className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                                      title="删除选项"
                                    >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 填空题提示 */}
                        {question.type === 'text' && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              提示内容
                            </label>
                            <input
                              type="text"
                              value={question.placeholder}
                              onChange={(e) => updateQuestion(question.id, { placeholder: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="请输入提示内容，如：请输入您的姓名"
                            />
                          </div>
                        )}
                      </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium mb-2">暂无题目</p>
                        <p className="text-sm">点击上方的"添加题目"按钮开始创建问卷</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelStepEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveStepEdit}
                  disabled={!stepEditData.title || stepEditData.questions.length === 0}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 任务环节编辑模态框 */}
      {editingStep && editingStep.type === 'task' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">编辑任务环节</h3>
                <button
                  onClick={cancelStepEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 任务标题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    任务标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stepEditData.title}
                    onChange={(e) => setStepEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入任务标题"
                    required
                  />
                </div>

                {/* 任务类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    任务类型 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'video', name: '视频任务', icon: '🎥', description: '提交视频文件' },
                      { id: 'audio', name: '语音任务', icon: '🎤', description: '提交音频文件' },
                      { id: 'text', name: '图文任务', icon: '📝', description: '提交文字和图片' },
                      { id: 'document', name: '文档任务', icon: '📄', description: '提交文档文件' }
                    ].map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setStepEditData(prev => ({ ...prev, taskType: type.id as any }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          stepEditData.taskType === type.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{type.icon}</div>
                          <h4 className="font-medium text-gray-900 mb-1">{type.name}</h4>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 任务要求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    任务要求 <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg">
                    {/* 富文本编辑器工具栏 */}
                    <div className="border-b border-gray-200 p-3 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                          title="粗体"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h5.5a3.5 3.5 0 013.5 3.5v1a3.5 3.5 0 01-3.5 3.5H6a1 1 0 01-1-1V4zm2 1v2h4.5a1.5 1.5 0 001.5-1.5v-1a1.5 1.5 0 00-1.5-1.5H7z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                          title="斜体"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9v6h1a1 1 0 110 2H9a1 1 0 01-1-1V3z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                          title="下划线"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="border-l border-gray-300 h-6 mx-2"></div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTaskImageUpload}
                          className="hidden"
                          id="task-image-upload"
                        />
                        <label
                          htmlFor="task-image-upload"
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded cursor-pointer"
                          title="上传图片"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                    
                    {/* 文本编辑区域 */}
                    <textarea
                      value={stepEditData.taskRequirements}
                      onChange={(e) => setStepEditData(prev => ({ ...prev, taskRequirements: e.target.value }))}
                      rows={8}
                      className="w-full px-3 py-3 border-0 rounded-b-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900"
                      placeholder="描述任务要求，任务要求将展示在学员界面"
                    />
                  </div>
                  
                  {/* 已上传的图片 */}
                  {stepEditData.taskImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">已上传的图片</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stepEditData.taskImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`任务图片 ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeTaskImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelStepEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveStepEdit}
                  disabled={!stepEditData.title || !stepEditData.taskType || !stepEditData.taskRequirements}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
