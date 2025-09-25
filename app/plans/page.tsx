'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap, Plus, Calendar, ChevronDown, Edit, Trash2 } from 'lucide-react'
import { useRole } from '../../contexts/RoleContext'
import { useNavigation } from '../../contexts/NavigationContext'
import { categoryMap, mockPlans, getPlansWithActualActivities } from '../../lib/mockData'

// 使用共享的数据源

const statusMap = {
  'PLANNED': { name: '计划中', color: 'bg-gray-100 text-gray-800' },
  'UPCOMING': { name: '即将开始', color: 'bg-yellow-100 text-yellow-800' },
  'ONGOING': { name: '进行中', color: 'bg-green-100 text-green-800' },
  'COMPLETED': { name: '已完成', color: 'bg-blue-100 text-blue-800' },
  'CANCELLED': { name: '已取消', color: 'bg-red-100 text-red-800' }
}

export default function PlansPage() {
  const { currentRole, setCurrentRole } = useRole()
  const { setLastPage } = useNavigation()
  const [selectedSemester, setSelectedSemester] = useState('2024-2025-2')
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set(['MORAL_EDUCATION']))
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{category: string, title: string} | null>(null)

  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: UserCheck, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)
  const currentPlans = getPlansWithActualActivities(selectedSemester)
  
  if (!currentPlans) {
    return <div>暂无计划数据</div>
  }

  const togglePlan = (category: string) => {
    const newExpanded = new Set(expandedPlans)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedPlans(newExpanded)
  }

  const handleDeletePlan = (category: string) => {
    if (currentPlans && currentPlans.plans[category as keyof typeof currentPlans.plans]) {
      delete (currentPlans.plans as any)[category]
      setShowDeleteConfirm(null)
      // 从展开列表中移除已删除的计划
      const newExpanded = new Set(expandedPlans)
      newExpanded.delete(category)
      setExpandedPlans(newExpanded)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
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
        {/* 页面标题和学期选择 */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">活动计划</h1>
              <p className="text-gray-600">五育活动计划管理，按德智体美劳分类展示</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* 创建活动按钮 - 教师、组长和校长可见 */}
                {(currentRole === 'TEACHER' || currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
                  <Link 
                    href="/activities/create" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                  >
                    创建活动
                  </Link>
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
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">学期：</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="2024-2025-1">2024-2025学年上学期</option>
                  <option value="2024-2025-2">2024-2025学年下学期</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 活动计划列表 */}
        <div className="space-y-6">
          {currentPlans ? (
            Object.entries(currentPlans.plans).map(([category, plan]: [string, any]) => {
            const categoryInfo = categoryMap[category as keyof typeof categoryMap]
            const isExpanded = expandedPlans.has(category)
            const CategoryIcon = categoryInfo.icon

            return (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* 计划头部 */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => togglePlan(category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`${categoryInfo.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                        <CategoryIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{plan.title}</h2>
                        <p className="text-sm text-gray-500">
                          {plan.directions.length} 个活动方向，共 {plan.directions.reduce((sum: number, dir: any) => sum + dir.activities.length, 0)} 个活动
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{categoryInfo.name}</span>
                      
                      {/* 编辑和删除按钮 - 仅组长和校长可见 */}
                      {(currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/plans/edit/${selectedSemester}/${category}`}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            编辑计划
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDeleteConfirm({category, title: plan.title})
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                          >
                            删除计划
                          </button>
                        </div>
                      )}
                      
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* 计划详情 */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="space-y-6">
                      {plan.directions.map((direction: any) => (
                        <div key={direction.id} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">{direction.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {direction.activities.map((activity: any) => {
                              const status = statusMap[activity.status as keyof typeof statusMap] || { name: '未知状态', color: 'bg-gray-100 text-gray-800' }
                              return (
                                <Link 
                                  key={activity.id} 
                                  href={`/activities/${activity.id}`}
                                  onClick={() => setLastPage('/plans')}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                >
                                  <span className="text-sm text-gray-700">{activity.name}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                    {status.name}
                                  </span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无计划数据</h3>
                <p className="text-gray-500 mb-6">
                  {selectedSemester === '2024-2025-2' 
                    ? '2024-2025学年下学期的活动计划尚未制定' 
                    : '该学期暂无活动计划数据'
                  }
                </p>
                {(currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') && (
                  <Link 
                    href="/plans/create" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                  >
                    创建活动计划
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">确认删除计划</h3>
              <p className="text-sm text-gray-500 mb-6">
                您确定要删除计划 <span className="font-medium text-gray-900">"{showDeleteConfirm.title}"</span> 吗？
                <br />
                <span className="text-red-600">此操作不可撤销。</span>
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeletePlan(showDeleteConfirm.category)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                >
                  确认删除
                </button>
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
