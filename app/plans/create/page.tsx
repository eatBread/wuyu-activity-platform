'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, Plus, X, Search, CheckCircle } from 'lucide-react'
import { useRole } from '../../../contexts/RoleContext'
import { addNewPlan } from '../../../lib/mockData'

const categoryMap = {
  'MORAL_EDUCATION': { name: '思想品德', short: '德', icon: Heart, color: 'bg-red-500' },
  'ACADEMIC_LEVEL': { name: '学业水平', short: '智', icon: BookOpen, color: 'bg-blue-500' },
  'PHYSICAL_HEALTH': { name: '身心健康', short: '体', icon: UserCheck, color: 'bg-green-500' },
  'ARTISTIC_LITERACY': { name: '艺术素养', short: '美', icon: Palette, color: 'bg-purple-500' },
  'SOCIAL_PRACTICE': { name: '社会实践', short: '劳', icon: Globe, color: 'bg-orange-500' }
}

// 现有活动数据
const existingActivities = [
  { id: '1', name: '踢毽子竞赛', categories: ['PHYSICAL_HEALTH', 'MORAL_EDUCATION'] },
  { id: '2', name: '书法艺术展', categories: ['ARTISTIC_LITERACY'] },
  { id: '3', name: '文明班级评比', categories: ['MORAL_EDUCATION'] },
  { id: '4', name: '数学竞赛', categories: ['ACADEMIC_LEVEL'] },
  { id: '5', name: '心理健康讲座', categories: ['MORAL_EDUCATION'] }
]

export default function CreatePlanPage() {
  const { currentRole, setCurrentRole } = useRole()
  const router = useRouter()
  const [formData, setFormData] = useState({
    semester: '2024-2025-1',
    category: 'MORAL_EDUCATION',
    title: '',
    directions: [
      { id: '1', name: '', activities: [] as Array<{id: string, name: string}> }
    ]
  })
  const [activitySearch, setActivitySearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: UserCheck, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)
  const selectedCategory = categoryMap[formData.category as keyof typeof categoryMap]

  const addDirection = () => {
    const newId = (formData.directions.length + 1).toString()
    setFormData({
      ...formData,
      directions: [
        ...formData.directions,
        { id: newId, name: '', activities: [] as Array<{id: string, name: string}> }
      ]
    })
  }

  const removeDirection = (directionId: string) => {
    if (formData.directions.length > 1) {
      setFormData({
        ...formData,
        directions: formData.directions.filter(dir => dir.id !== directionId)
      })
    }
  }

  const updateDirection = (directionId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      directions: formData.directions.map(dir =>
        dir.id === directionId ? { ...dir, [field]: value } : dir
      )
    })
  }

  const addActivityToDirection = (directionId: string, activityId: string) => {
    const activity = existingActivities.find(act => act.id === activityId)
    if (!activity) return

    setFormData({
      ...formData,
      directions: formData.directions.map(dir => {
        if (dir.id === directionId) {
          // 检查是否已经添加了这个活动
          if (dir.activities.some(act => act.id === activityId)) {
            return dir
          }
          return {
            ...dir,
            activities: [...dir.activities, { id: activity.id, name: activity.name }]
          }
        }
        return dir
      })
    })
  }

  const removeActivityFromDirection = (directionId: string, activityId: string) => {
    setFormData({
      ...formData,
      directions: formData.directions.map(dir => {
        if (dir.id === directionId) {
          return {
            ...dir,
            activities: dir.activities.filter(act => act.id !== activityId)
          }
        }
        return dir
      })
    })
  }

  // 获取符合当前类别的活动
  const getFilteredActivities = () => {
    return existingActivities.filter(activity => 
      activity.categories.includes(formData.category) &&
      activity.name.toLowerCase().includes(activitySearch.toLowerCase())
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 实际保存计划到数据源
      const success = addNewPlan(formData)
      
      if (success) {
        console.log('计划创建成功:', formData)
        
        // 显示成功提示
        setShowSuccess(true)
        
        // 2秒后跳转到活动计划页面
        setTimeout(() => {
          router.push('/plans')
        }, 2000)
      } else {
        console.error('计划创建失败')
      }
      
    } catch (error) {
      console.error('创建计划失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 成功提示弹窗 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">计划创建成功！</h3>
            <p className="text-gray-600 mb-4">活动计划已成功创建，即将跳转到活动计划页面...</p>
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
              <Link href="/plans" className="flex items-center">
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
                className="text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                活动计划
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link 
            href="/plans" 
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回活动计划
          </Link>
        </div>

        {/* 页面标题和操作按钮 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">创建活动计划</h1>
              <p className="text-gray-600">创建新的五育活动计划，包含活动方向和具体活动</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/plans"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                取消
              </Link>
              <button
                type="submit"
                form="create-plan-form"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isSubmitting ? '创建中...' : '创建计划'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 创建表单 */}
        <form id="create-plan-form" onSubmit={handleSubmit} className="space-y-8">
          {/* 基本信息 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学期
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="2024-2025-1">2024-2025学年上学期</option>
                  <option value="2024-2025-2">2024-2025学年下学期</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动类别
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {Object.entries(categoryMap).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                计划标题
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`${selectedCategory.name}活动计划`}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 活动方向 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">活动方向</h2>
              <button
                type="button"
                onClick={addDirection}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>添加方向</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.directions.map((direction, index) => (
                <div key={direction.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900">活动方向 {index + 1}</h3>
                    {formData.directions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDirection(direction.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      方向名称
                    </label>
                    <input
                      type="text"
                      value={direction.name}
                      onChange={(e) => updateDirection(direction.id, 'name', e.target.value)}
                      placeholder="如：主题教育类、习惯养成类等"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* 具体活动 */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        具体活动
                      </label>
                    </div>
                    
                    {/* 已选择的活动 */}
                    {direction.activities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">已选择的活动：</h4>
                        <div className="space-y-2">
                          {direction.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                              <span className="text-sm text-gray-700">{activity.name}</span>
                              <button
                                type="button"
                                onClick={() => removeActivityFromDirection(direction.id, activity.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 活动选择器 */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={activitySearch}
                          onChange={(e) => setActivitySearch(e.target.value)}
                          placeholder="搜索活动..."
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="max-h-40 overflow-y-auto">
                        {getFilteredActivities().length > 0 ? (
                          <div className="space-y-1">
                            {getFilteredActivities().map((activity) => {
                              const isSelected = direction.activities.some(act => act.id === activity.id)
                              return (
                                <button
                                  key={activity.id}
                                  type="button"
                                  onClick={() => addActivityToDirection(direction.id, activity.id)}
                                  disabled={isSelected}
                                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                                    isSelected
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'hover:bg-primary-50 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{activity.name}</span>
                                    {isSelected && (
                                      <span className="text-xs text-gray-400">已选择</span>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            没有找到符合条件的活动
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </form>
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
