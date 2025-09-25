'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, Settings, List, Users, Award, FileText, Play, ClipboardList, Target, Plus, Trash2, Edit, GripVertical, CheckCircle } from 'lucide-react'
import { useRole } from '../../../contexts/RoleContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { categoryMap, statusMap, getActivityPlansForSelection, observationPoints, getObservationPointsByCategory, addNewActivity, getTemplateById } from '../../../lib/mockData'

// 活动计划数据将在组件内部动态获取

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
  { id: 'process-overview', name: '流程概览', icon: List },
  { id: 'process-details', name: '详细流程', icon: FileText }
]

// 参与人员的子步骤
const participantSections = [
  { id: 'participant-list', name: '参与名单', icon: Users },
  { id: 'participant-rules', name: '参与规则', icon: UserCheck }
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

// 包装组件处理 useSearchParams
function CreateActivityContent() {
  const { currentRole, setCurrentRole } = useRole()
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const [currentMainStep, setCurrentMainStep] = useState('basic-settings')
  const [activeSection, setActiveSection] = useState('basic-info')
  const [selectedSemester, setSelectedSemester] = useState('2024-2025-2') // 默认下学期
  const [showAddStepModal, setShowAddStepModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingStep, setEditingStep] = useState<any>(null)
  const [showStepPreview, setShowStepPreview] = useState<any>(null)
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
      
      // 实际保存活动到数据源
      const currentUserId = `${currentRole.toLowerCase()}-1` // 模拟当前用户ID
      const success = addNewActivity(activityData, currentUserId)
      
      if (success) {
        console.log('活动创建成功:', activityData)
        
        // 显示成功提示
        setShowSuccess(true)
        
        // 2秒后跳转到活动广场页面
        setTimeout(() => {
          router.push('/activities')
        }, 2000)
      } else {
        console.error('活动创建失败')
        alert('活动创建失败，请重试')
      }
      
    } catch (error) {
      console.error('创建活动失败:', error)
      alert('创建活动失败，请重试')
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
  }, [currentMainStep]) // 依赖当前主要步骤

  // 处理模板数据加载
  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId)
      if (template) {
        // 使用模板数据填充表单
        setFormData(prev => ({
          ...prev,
          title: template.templateData.title,
          description: template.templateData.description,
          organizer: template.templateData.organizer,
          grades: template.templateData.grades,
          classes: template.templateData.classes,
          categories: template.templateData.categories,
          location: template.templateData.location,
          startDate: template.templateData.startDate,
          endDate: template.templateData.endDate,
          startTime: template.templateData.startTime,
          endTime: template.templateData.endTime,
          maxParticipants: template.templateData.maxParticipants,
          responsibleTeacher: template.templateData.responsibleTeacher,
          requireRegistration: template.templateData.requireRegistration,
          observationPoints: template.templateData.observationPoints,
          processSteps: template.templateData.processSteps,
          selectedPlans: template.templateData.selectedPlans
        }))
      }
    }
  }, [templateId])


  // 流程管理函数
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
      type,
      title: stepTitle,
      order: formData.processSteps.length,
      data: getDefaultStepData(type)
    }
    
    setShowAddStepModal(false)
    
    // 如果是图文、签到、视频、问卷或任务类型，直接进入编辑模式
    if (type === 'content' || type === 'checkin' || type === 'video' || type === 'questionnaire' || type === 'task') {
      setEditingStep(newStep)
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
        return { 
          description: '' 
        }
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

  const updateProcessStep = (stepId: string, updates: any) => {
    const newSteps = formData.processSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    )
    updateFormData('processSteps', newSteps)
  }

  const deleteProcessStep = (stepId: string) => {
    const newSteps = formData.processSteps.filter(step => step.id !== stepId)
    // 重新排序
    const reorderedSteps = newSteps.map((step, index) => ({ ...step, order: index }))
    updateFormData('processSteps', reorderedSteps)
  }

  const moveProcessStep = (stepId: string, direction: 'up' | 'down') => {
    const steps = [...formData.processSteps]
    const currentIndex = steps.findIndex(step => step.id === stepId)
    
    if (direction === 'up' && currentIndex > 0) {
      [steps[currentIndex], steps[currentIndex - 1]] = [steps[currentIndex - 1], steps[currentIndex]]
    } else if (direction === 'down' && currentIndex < steps.length - 1) {
      [steps[currentIndex], steps[currentIndex + 1]] = [steps[currentIndex + 1], steps[currentIndex]]
    }
    
    // 重新排序
    const reorderedSteps = steps.map((step, index) => ({ ...step, order: index }))
    updateFormData('processSteps', reorderedSteps)
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
      // 签到环节数据
      checkinDescription: step.data?.description || '',
      // 视频环节数据
      videoFile: step.data?.videoFile || null,
      videoDescription: step.data?.description || '',
      // 问卷环节数据
      questionnaireTitle: step.data?.title || '',
      questionnaireDescription: step.data?.description || '',
      questions: step.data?.questions || [
        {
          id: `q_${Date.now()}`,
          type: 'single' as 'single' | 'multiple' | 'text',
          title: '请选择您的答案',
          options: ['选项1', '选项2'],
          placeholder: '请输入您的答案'
        }
      ],
      // 任务环节数据
      taskTitle: step.data?.title || '',
      taskType: step.data?.type || 'video',
      taskRequirements: step.data?.requirements || '',
      taskImages: step.data?.images || []
    })
  }

  const saveStepEdit = () => {
    if (editingStep) {
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
        taskType: 'video',
        taskRequirements: '',
        taskImages: []
      })
    }
  }

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
      taskType: 'video',
      taskRequirements: '',
      taskImages: []
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setStepEditData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setStepEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setStepEditData(prev => ({
        ...prev,
        videoFile: file
      }))
    }
  }

  const removeVideo = () => {
    setStepEditData(prev => ({
      ...prev,
      videoFile: null
    }))
  }

  const handleTaskImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setStepEditData(prev => ({
      ...prev,
      taskImages: [...prev.taskImages, ...files]
    }))
  }

  const removeTaskImage = (index: number) => {
    setStepEditData(prev => ({
      ...prev,
      taskImages: prev.taskImages.filter((_, i) => i !== index)
    }))
  }

  // 问卷管理函数
  const addQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      type: 'single' as 'single' | 'multiple' | 'text',
      title: '请选择您的答案',
      options: ['选项1', '选项2'],
      placeholder: '请输入您的答案'
    }
    setStepEditData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
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

  const deleteQuestion = (questionId: string) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const addOption = (questionId: string) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: [...q.options, ''] }
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
              options: q.options.map((opt, idx) => 
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    }))
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    setStepEditData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.filter((_, idx) => idx !== optionIndex)
            }
          : q
      )
    }))
  }

  // 添加活动计划
  const addActivityPlan = (planId: string, planName: string, direction: string) => {
    const newPlan = { planId, planName, direction }
    const existingPlan = formData.selectedPlans.find(p => p.planId === planId && p.direction === direction)
    if (!existingPlan) {
      updateFormData('selectedPlans', [...formData.selectedPlans, newPlan])
    }
  }

  // 移除活动计划
  const removeActivityPlan = (planId: string, direction: string) => {
    const newPlans = formData.selectedPlans.filter(p => !(p.planId === planId && p.direction === direction))
    updateFormData('selectedPlans', newPlans)
  }

  // 处理观测点选择
  const toggleObservationPoint = (pointId: string) => {
    const currentPoints = formData.observationPoints
    if (currentPoints.includes(pointId)) {
      updateFormData('observationPoints', currentPoints.filter(id => id !== pointId))
    } else {
      updateFormData('observationPoints', [...currentPoints, pointId])
    }
  }

  // 处理观测点类别选择
  const handleObservationCategorySelect = (category: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    setSelectedObservationCategory(category)
    // 滚动到对应的观测点区域
    const element = document.getElementById(`observation-category-${category}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 动态获取活动计划数据
  const activityPlans = getActivityPlansForSelection(selectedSemester)
  
  // 获取可选的观测点（根据活动类别过滤）
  const availableObservationPoints = getObservationPointsByCategory(formData.categories)
  
  // 观测点类别选择状态
  const [selectedObservationCategory, setSelectedObservationCategory] = useState('MORAL_EDUCATION')

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

  // 获取可用的活动计划
  const getAvailablePlans = () => {
    const availablePlans: any[] = []
    formData.categories.forEach(category => {
      if (activityPlans[category as keyof typeof activityPlans]) {
        availablePlans.push(...activityPlans[category as keyof typeof activityPlans])
      }
    })
    return availablePlans
  }

  if (!canCreateActivity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">权限不足</h1>
          <p className="text-gray-600 mb-4">只有教师、教师组长和校长可以创建活动</p>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">活动创建成功！</h3>
            <p className="text-gray-600 mb-4">活动已成功创建，即将跳转到活动广场...</p>
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
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link 
            href="/activities" 
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回活动广场
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建活动</h1>
          <p className="text-gray-600">创建新的五育活动，设置活动详情和参与规则</p>
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
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
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
              disabled={currentMainStep === 'participants'}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                currentMainStep === 'participants'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              下一步
            </button>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
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
                            ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                            : 'text-gray-700 hover:bg-gray-100'
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      参与年级 *
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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        参与班级
                      </label>
                      <span className="text-xs text-gray-500">不选择具体班级则默认全年级参与</span>
                    </div>
                    {formData.grades.length > 0 ? (
                      <div className="space-y-3">
                        {formData.grades.map((grade) => {
                          // 直接使用年级名称，不需要解析数字
                          return (
                            <div key={grade} className="border border-gray-200 rounded-lg p-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">{grade}</h4>
                              <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 5 }, (_, classIndex) => {
                                  const className = `${grade}${classIndex + 1}班`
                                  const isSelected = formData.classes.includes(className)
                                  return (
                                    <button
                                      key={className}
                                      type="button"
                                      onClick={() => {
                                        const newClasses = isSelected
                                          ? formData.classes.filter(c => c !== className)
                                          : [...formData.classes, className]
                                        updateFormData('classes', newClasses)
                                      }}
                                      className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                                        isSelected
                                          ? 'bg-primary-600 text-white'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                      }`}
                                    >
                                      {grade}{classIndex + 1}班
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
                        请先选择参与年级
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      活动类别 *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(categoryMap).map(([key, category]) => {
                        const IconComponent = category.icon
                        const isSelected = formData.categories.includes(key)
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              const newCategories = isSelected
                                ? formData.categories.filter(cat => cat !== key)
                                : [...formData.categories, key]
                              updateFormData('categories', newCategories)
                            }}
                            className={`flex items-center space-x-2 p-3 rounded-md border-2 transition-colors duration-200 ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div className={`${category.color} w-6 h-6 rounded-full flex items-center justify-center`}>
                              <IconComponent className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-medium">{category.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 活动计划选择 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      活动计划
                    </label>
                    {formData.categories.length > 0 ? (
                      <div className="space-y-4">
                        {getAvailablePlans().map((plan) => (
                          <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">{plan.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {plan.directions.map((direction: string) => {
                                const isSelected = formData.selectedPlans.some(p => p.planId === plan.id && p.direction === direction)
                                return (
                                  <button
                                    key={direction}
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        removeActivityPlan(plan.id, direction)
                                      } else {
                                        addActivityPlan(plan.id, plan.name, direction)
                                      }
                                    }}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                      isSelected
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {direction}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                        
                        {/* 已选择的计划显示 */}
                        {formData.selectedPlans.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">已选择的计划：</h5>
                            <div className="space-y-2">
                              {formData.selectedPlans.map((plan, index) => (
                                <div key={index} className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-md p-3">
                                  <div>
                                    <span className="text-sm font-medium text-primary-700">{plan.planName}</span>
                                    <span className="text-sm text-primary-600 ml-2">- {plan.direction}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeActivityPlan(plan.planId, plan.direction)}
                                    className="text-primary-600 hover:text-primary-700"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
                        请先选择活动类别
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      活动地点
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateFormData('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="请输入活动地点"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        开始日期 *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormData('startDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        结束日期 *
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateFormData('endDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        开始时间 *
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => updateFormData('startTime', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        结束时间 *
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => updateFormData('endTime', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最大参与人数 *
                      </label>
                      <input
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => updateFormData('maxParticipants', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        负责老师 *
                      </label>
                      <input
                        type="text"
                        value={formData.responsibleTeacher}
                        onChange={(e) => updateFormData('responsibleTeacher', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="请输入负责老师姓名"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      活动方案
                    </label>
                    <input
                      type="file"
                      onChange={(e) => updateFormData('activityPlan', e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">支持 PDF、Word 文档格式</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      活动封面
                    </label>
                    <input
                      type="file"
                      onChange={(e) => updateFormData('coverImage', e.target.files?.[0] || null)}
                      accept="image/*"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">支持 JPG、PNG 等图片格式</p>
                  </div>
                </div>
              </div>

              {/* 报名设置 */}
              <div id="registration" className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">报名设置</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        是否需要报名
                      </label>
                      <p className="text-xs text-gray-500">开启后学生需要主动报名参与活动</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateFormData('requireRegistration', !formData.requireRegistration)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        formData.requireRegistration ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          formData.requireRegistration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                </div>
              </div>

              {/* 综评设置 */}
              <div id="evaluation" className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">综评设置</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      综合素质评价观测点
                    </label>
                    <div className="text-sm text-gray-500 mb-3">
                      请选择与活动相关的观测点（可多选）
                    </div>
                    
                    {availableObservationPoints.length === 0 ? (
                      <div className="text-gray-500 text-sm py-4 text-center border border-gray-200 rounded-md">
                        请先选择活动类别以显示相关观测点
                      </div>
                    ) : (
                      <div className="flex border border-gray-200 rounded-md max-h-64">
                        {/* 左侧类别导航 */}
                        <div className="w-32 bg-gray-50 border-r border-gray-200 flex-shrink-0">
                          <div className="p-2 space-y-1">
                            {Object.keys(
                              availableObservationPoints.reduce((acc, point) => {
                                acc[point.category] = true
                                return acc
                              }, {} as Record<string, boolean>)
                            ).map((category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={(e) => handleObservationCategorySelect(category, e)}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                  selectedObservationCategory === category
                                    ? 'bg-primary-100 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className={`w-2 h-2 rounded-full mr-2 ${categoryMap[category as keyof typeof categoryMap]?.color}`}></span>
                                  {categoryMap[category as keyof typeof categoryMap]?.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* 右侧观测点列表 */}
                        <div className="flex-1 overflow-y-auto">
                          {Object.entries(
                            availableObservationPoints.reduce((acc, point) => {
                              if (!acc[point.category]) {
                                acc[point.category] = []
                              }
                              acc[point.category].push(point)
                              return acc
                            }, {} as Record<string, typeof availableObservationPoints>)
                          ).map(([category, points]) => (
                            <div key={category} id={`observation-category-${category}`} className="p-4">
                              <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                                  <span className={`w-3 h-3 rounded-full mr-2 ${categoryMap[category as keyof typeof categoryMap]?.color}`}></span>
                                  {categoryMap[category as keyof typeof categoryMap]?.name}
                                </h4>
                              </div>
                              <div className="space-y-3">
                                {points.map((point) => (
                                  <div key={point.id} className="flex items-start space-x-3">
                                    <input
                                      type="checkbox"
                                      id={`observation-${point.id}`}
                                      checked={formData.observationPoints.includes(point.id)}
                                      onChange={(e) => {
                                        e.stopPropagation()
                                        toggleObservationPoint(point.id)
                                      }}
                                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <div className="flex-1">
                                      <label htmlFor={`observation-${point.id}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                                        {point.name} - {point.subcategory}
                                      </label>
                                      <p className="text-xs text-gray-600 mt-1">{point.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formData.observationPoints.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">已选择的观测点：</div>
                        <div className="flex flex-wrap gap-2">
                          {formData.observationPoints.map((pointId) => {
                            const point = observationPoints.find(p => p.id === pointId)
                            return point ? (
                              <span key={pointId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                {point.name}
                                <button
                                  type="button"
                                  onClick={() => toggleObservationPoint(pointId)}
                                  className="ml-1.5 h-3 w-3 text-primary-400 hover:text-primary-600"
                                >
                                  ×
                                </button>
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>



                {/* 取消按钮 */}
                <div className="flex justify-end">
                  <Link
                    href="/activities"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    取消
                  </Link>
                </div>
              </form>
            )}

            {/* 活动流程表单 */}
            {currentMainStep === 'activity-process' && (
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
                                    onClick={() => startEditingStep(step)}
                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
                                    title="编辑"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  
                                  {/* 删除按钮 */}
                                  <button
                                    type="button"
                                    onClick={() => deleteProcessStep(step.id)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
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

                {/* 详细流程 */}
                <div id="process-details" className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">详细流程</h2>
                  <p className="text-gray-600">点击上方环节的编辑按钮来配置详细信息</p>
                </div>
                
                {/* 取消按钮 */}
                <div className="flex justify-end">
                  <Link
                    href="/activities"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    取消
                  </Link>
                </div>
              </div>
            )}

            {/* 参与人员表单 */}
            {currentMainStep === 'participants' && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">参与人员</h2>
                  <p className="text-gray-600">参与人员设置功能正在开发中...</p>
                </div>
                
                {/* 取消和创建按钮 */}
                <div className="flex justify-end space-x-4">
                  <Link
                    href="/activities"
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    取消
                  </Link>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        创建中...
                      </>
                    ) : (
                      '创建活动'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

      {/* 签到环节预览模态框 */}
      {showStepPreview && showStepPreview.type === 'checkin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">预览签到环节</h3>
                <button
                  onClick={() => setShowStepPreview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 环节标题 */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{showStepPreview.title}</h2>
                </div>

                {/* 签到信息 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        {showStepPreview.title || '签到'}
                      </h3>
                      <p className="text-sm text-green-600">参与者需要点击签到按钮</p>
                    </div>
                  </div>
                  
                  {showStepPreview.data?.description && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-green-800 mb-2">签到说明</h4>
                      <p className="text-green-700 whitespace-pre-wrap">
                        {showStepPreview.data.description}
                      </p>
                    </div>
                  )}
                  
                  {/* 模拟签到按钮 */}
                  <div className="mt-6">
                    <button
                      type="button"
                      disabled
                      className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium opacity-75 cursor-not-allowed"
                    >
                      签到按钮（参与者可点击）
                    </button>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowStepPreview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStepPreview(null)
                    startEditingStep(showStepPreview)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  编辑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 视频环节预览模态框 */}
      {showStepPreview && showStepPreview.type === 'video' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">预览视频环节</h3>
                <button
                  onClick={() => setShowStepPreview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 环节标题 */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{showStepPreview.title}</h2>
                </div>

                {/* 视频信息 */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-800">视频学习</h3>
                      <p className="text-sm text-purple-600">参与者需要观看视频进行学习</p>
                    </div>
                  </div>
                  
                  {/* 视频播放区域 */}
                  <div className="mt-4">
                    {showStepPreview.data?.videoFile ? (
                      <div className="bg-gray-900 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 text-white">
                          <Play className="h-8 w-8" />
                          <span className="text-lg font-medium">视频播放器</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                          文件：{showStepPreview.data.videoFile.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          大小：{(showStepPreview.data.videoFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">暂无视频文件</p>
                      </div>
                    )}
                  </div>
                  
                  {showStepPreview.data?.description && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-purple-800 mb-2">视频说明</h4>
                      <p className="text-purple-700 whitespace-pre-wrap">
                        {showStepPreview.data.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowStepPreview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStepPreview(null)
                    startEditingStep(showStepPreview)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  编辑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 问卷环节预览模态框 */}
      {showStepPreview && showStepPreview.type === 'questionnaire' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">预览问卷环节</h3>
                <button
                  onClick={() => setShowStepPreview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 环节标题 */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{showStepPreview.title}</h2>
                </div>

                {/* 问卷信息 */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <ClipboardList className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-800">问卷调查</h3>
                      <p className="text-sm text-orange-600">参与者需要填写问卷</p>
                    </div>
                  </div>
                  
                  {/* 问卷说明 */}
                  {showStepPreview.data?.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-orange-800 mb-2">问卷说明</h4>
                      <p className="text-orange-700 whitespace-pre-wrap">
                        {showStepPreview.data.description}
                      </p>
                    </div>
                  )}

                  {/* 问题预览 */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-orange-800 mb-3">问卷题目</h4>
                    <div className="space-y-4">
                      {showStepPreview.data?.questions?.map((question: any, index: number) => (
                        <div key={question.id} className="bg-white border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 mb-2">{question.title || '未填写题目'}</h5>
                              
                              {/* 单选题 */}
                              {question.type === 'single' && (
                                <div className="space-y-2">
                                  {question.options?.map((option: string, optionIndex: number) => (
                                    <label key={optionIndex} className="flex items-center space-x-2">
                                      <input type="radio" disabled className="text-orange-600" />
                                      <span className="text-gray-700">{option || `选项 ${optionIndex + 1}`}</span>
                                    </label>
                                  ))}
                                </div>
                              )}

                              {/* 多选题 */}
                              {question.type === 'multiple' && (
                                <div className="space-y-2">
                                  {question.options?.map((option: string, optionIndex: number) => (
                                    <label key={optionIndex} className="flex items-center space-x-2">
                                      <input type="checkbox" disabled className="text-orange-600" />
                                      <span className="text-gray-700">{option || `选项 ${optionIndex + 1}`}</span>
                                    </label>
                                  ))}
                                </div>
                              )}

                              {/* 填空题 */}
                              {question.type === 'text' && (
                                <div>
                                  <input
                                    type="text"
                                    disabled
                                    placeholder={question.placeholder || '请输入答案'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowStepPreview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStepPreview(null)
                    startEditingStep(showStepPreview)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  编辑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 任务环节预览模态框 */}
      {showStepPreview && showStepPreview.type === 'task' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">预览任务环节</h3>
                <button
                  onClick={() => setShowStepPreview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 环节标题 */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{showStepPreview.title}</h2>
                </div>

                {/* 任务信息 */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">任务提交</h3>
                      <p className="text-sm text-red-600">参与者需要完成任务并提交</p>
                    </div>
                  </div>
                  
                  {/* 任务类型 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">任务类型</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {showStepPreview.data?.type === 'video' && '🎥'}
                        {showStepPreview.data?.type === 'audio' && '🎤'}
                        {showStepPreview.data?.type === 'text' && '📝'}
                        {showStepPreview.data?.type === 'document' && '📄'}
                      </span>
                      <span className="text-red-700 font-medium">
                        {showStepPreview.data?.type === 'video' && '视频任务'}
                        {showStepPreview.data?.type === 'audio' && '语音任务'}
                        {showStepPreview.data?.type === 'text' && '图文任务'}
                        {showStepPreview.data?.type === 'document' && '文档任务'}
                      </span>
                    </div>
                  </div>

                  {/* 任务要求 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">任务要求</h4>
                    <div className="bg-white border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 whitespace-pre-wrap">
                        {showStepPreview.data?.requirements || '暂无任务要求'}
                      </p>
                      
                      {/* 任务图片 */}
                      {showStepPreview.data?.images && showStepPreview.data.images.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-red-800 mb-2">参考图片</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {showStepPreview.data.images.map((image: File, index: number) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`任务图片 ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-red-200"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 提交区域 */}
                  <div className="bg-white border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">提交区域</h4>
                    <div className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center">
                      <div className="text-red-400 mb-2">
                        {showStepPreview.data?.type === 'video' && '🎥'}
                        {showStepPreview.data?.type === 'audio' && '🎤'}
                        {showStepPreview.data?.type === 'text' && '📝'}
                        {showStepPreview.data?.type === 'document' && '📄'}
                      </div>
                      <p className="text-red-600 text-sm">
                        {showStepPreview.data?.type === 'video' && '点击上传视频文件'}
                        {showStepPreview.data?.type === 'audio' && '点击上传音频文件'}
                        {showStepPreview.data?.type === 'text' && '点击上传文字和图片'}
                        {showStepPreview.data?.type === 'document' && '点击上传文档文件'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowStepPreview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStepPreview(null)
                    startEditingStep(showStepPreview)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  编辑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 环节预览模态框 */}
      {showStepPreview && showStepPreview.type === 'content' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">预览图文环节</h3>
                <button
                  onClick={() => setShowStepPreview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* 环节标题 */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{showStepPreview.title}</h2>
                </div>

                {/* 环节内容 */}
                <div className="prose max-w-none">
                  {showStepPreview.data?.content ? (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {showStepPreview.data.content}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">暂无内容</p>
                  )}
                </div>

                {/* 图片展示 */}
                {showStepPreview.data?.images && showStepPreview.data.images.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">相关图片</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {showStepPreview.data.images.map((image: File, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`环节图片 ${index + 1}`}
                            className="w-full h-auto rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowStepPreview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStepPreview(null)
                    startEditingStep(showStepPreview)
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  编辑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加环节模态框 */}
      {showAddStepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">选择环节类型</h3>
                <button
                  onClick={() => setShowAddStepModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processStepTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => addProcessStep(type.id)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{type.name}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
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
                  onClick={() => setCurrentRole(role.id as any)}
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
    </div>
  )
}

// 主组件，使用Suspense包装
export default function CreateActivityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <CreateActivityContent />
    </Suspense>
  )
}
