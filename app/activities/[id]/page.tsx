'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, User, Clock, BookOpen, Heart, Palette, Globe, UserCheck, Crown, GraduationCap } from 'lucide-react'
import { useRole } from '../../../contexts/RoleContext'
import { useNavigation } from '../../../contexts/NavigationContext'
import { useRouter } from 'next/navigation'
import { getObservationPointById, mockActivities, deleteActivity } from '../../../lib/mockData'

// 将活动列表数据转换为详情页格式
const getActivityDetail = (id: string) => {
  const activity = mockActivities.find(a => a.id === id)
  if (!activity) return null
  
  // 根据活动类型生成不同的观测点和流程
  const getObservationPoints = (categories: string[]) => {
    if (categories.includes('MORAL_EDUCATION')) {
      return ['2', '3', '4'] // 品德发展相关观测点
    } else if (categories.includes('PHYSICAL_HEALTH')) {
      return ['13'] // 体育技能观测点
    }
    return []
  }
  
  const getProcessSteps = (activity: any) => {
    if (activity.title === '文明班级评比') {
      return [
        {
          id: 'step1',
          type: 'content',
          title: '活动介绍',
          order: 0,
          data: {
            content: '<h3>文明班级评比活动介绍</h3><p>欢迎参加文明班级评比活动！本次活动旨在通过多维度评价，培养同学们良好的品德修养、文明礼仪和集体荣誉感。</p><p><strong>活动目标：</strong></p><ul><li>培养学生文明礼仪意识</li><li>增强集体荣誉感</li><li>营造积极向上的班级氛围</li><li>促进班级文化建设</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin',
          title: '文明班级评比签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与评比活动'
          }
        },
        {
          id: 'step3',
          type: 'questionnaire',
          title: '班级文明公约制定',
          order: 2,
          data: {
            title: '班级文明公约制定问卷',
            description: '请各班级根据实际情况制定班级文明公约',
            questions: [
              {
                id: 'q1',
                type: 'single',
                title: '您认为班级文明公约应该包含哪些内容？',
                options: ['课堂纪律', '卫生保持', '文明用语', '团结互助', '以上全部'],
                placeholder: ''
              },
              {
                id: 'q2',
                type: 'multiple',
                title: '班级文明公约的执行方式，您认为哪些比较有效？',
                options: ['班干部监督', '同学互相提醒', '定期评比', '家长参与', '老师指导'],
                placeholder: ''
              },
              {
                id: 'q3',
                type: 'text',
                title: '请简述您对班级文明建设的建议：',
                options: [],
                placeholder: '请输入您的建议...'
              }
            ]
          }
        },
        {
          id: 'step4',
          type: 'task',
          title: '班级文明公约提交',
          order: 3,
          data: {
            title: '班级文明公约提交任务',
            type: 'document',
            requirements: '<h4>任务要求：</h4><p>请各班级制定并提交班级文明公约，要求：</p><ol><li>公约内容要具体、可操作</li><li>体现班级特色</li><li>包含奖惩措施</li><li>字数不少于200字</li></ol><p>请以Word文档形式提交，文件命名为"XX班文明公约.docx"</p>',
            images: []
          }
        },
        {
          id: 'step5',
          type: 'content',
          title: '评比标准说明',
          order: 4,
          data: {
            content: '<h3>文明班级评比标准</h3><h4>一、日常行为规范（40分）</h4><ul><li>课堂纪律：10分</li><li>课间文明：10分</li><li>卫生保持：10分</li><li>文明用语：10分</li></ul><h4>二、班级文化建设（30分）</h4><ul><li>班级公约制定：15分</li><li>班级环境布置：15分</li></ul><h4>三、团队协作表现（30分）</h4><ul><li>集体活动参与：15分</li><li>同学互助友爱：15分</li></ul>',
            images: []
          }
        }
      ]
    } else if (activity.title === '班级拔河比赛') {
      return [
        {
          id: 'step1',
          type: 'content',
          title: '比赛介绍',
          order: 0,
          data: {
            content: '<h3>班级拔河比赛介绍</h3><p>欢迎参加班级拔河比赛！拔河是一项传统的团队竞技运动，能够有效培养学生的团队合作精神、集体荣誉感和体育竞技能力。</p><p><strong>比赛目标：</strong></p><ul><li>增强班级凝聚力和团队合作精神</li><li>提高学生的体育技能和身体素质</li><li>培养集体荣誉感和竞争意识</li><li>促进班级间的友谊交流</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin',
          title: '班级拔河比赛签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与拔河比赛'
          }
        },
        {
          id: 'step3',
          type: 'content',
          title: '比赛规则说明',
          order: 2,
          data: {
            content: '<h3>拔河比赛规则</h3><h4>一、参赛要求</h4><ul><li>每班参赛人数：20人（男女各10人）</li><li>参赛学生必须身体健康，无心脏病等疾病</li><li>比赛前需进行充分热身</li></ul><h4>二、比赛规则</h4><ul><li>比赛采用三局两胜制</li><li>每局比赛时间不超过2分钟</li><li>比赛过程中不得换人</li><li>比赛过程中不得故意松手或恶意犯规</li></ul><h4>三、胜负判定</h4><ul><li>将对方拉过中线即为获胜</li><li>比赛时间到，以绳子中心点位置判定胜负</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'video',
          title: '拔河技巧教学',
          order: 3,
          data: {
            title: '拔河技巧教学视频',
            description: '观看拔河技巧教学视频，学习正确的拔河姿势和技巧'
          }
        },
        {
          id: 'step5',
          type: 'task',
          title: '比赛总结提交',
          order: 4,
          data: {
            title: '比赛总结提交任务',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请各班级在比赛结束后提交比赛总结，内容包括：</p><ol><li>比赛过程中的感受和体会</li><li>团队合作的重要性认识</li><li>对体育竞技精神的理解</li><li>对班级凝聚力的提升作用</li></ol><p>字数要求：不少于300字</p>',
            images: []
          }
        }
      ]
    }
    
    // 默认流程
    return [
      {
        id: 'step1',
        type: 'content',
        title: '活动介绍',
        order: 0,
        data: {
          content: `<h3>${activity.title}活动介绍</h3><p>${activity.description}</p>`,
          images: []
        }
      }
    ]
  }
  
  return {
    id: activity.id,
    title: activity.title,
    organizer: '广州华颖外国语学校',
    categories: activity.categories,
    grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
    classes: ['一年级1班', '一年级2班', '一年级3班', '二年级1班', '二年级2班', '三年级1班', '三年级2班', '四年级1班', '四年级2班', '五年级1班', '五年级2班', '六年级1班', '六年级2班', '七年级1班', '七年级2班', '八年级1班', '八年级2班', '九年级1班', '九年级2班'],
    participants: activity.participants,
    maxParticipants: activity.maxParticipants,
    startTime: `${activity.startDate} 08:00`,
    endTime: `${activity.endDate} 18:00`,
    location: activity.location,
    responsibleTeacher: activity.creator,
    createdBy: activity.createdBy, // 添加创建者字段
    observationPoints: getObservationPoints(activity.categories),
    description: activity.description,
    coverImage: activity.coverImage,
    activityDirection: activity.activityDirection,
    activityPlan: activity.activityPlan,
    requireRegistration: false, // 是否需要报名
    processSteps: getProcessSteps(activity)
  }
}

const categoryMap = {
  'MORAL_EDUCATION': { name: '思想品德', short: '德', icon: Heart, color: 'bg-red-500' },
  'ACADEMIC_LEVEL': { name: '学业水平', short: '智', icon: BookOpen, color: 'bg-blue-500' },
  'PHYSICAL_HEALTH': { name: '身心健康', short: '体', icon: Users, color: 'bg-green-500' },
  'ARTISTIC_LITERACY': { name: '艺术素养', short: '美', icon: Palette, color: 'bg-purple-500' },
  'SOCIAL_PRACTICE': { name: '社会实践', short: '劳', icon: Globe, color: 'bg-orange-500' }
}


export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const { currentRole, setCurrentRole } = useRole()
  const { lastPage } = useNavigation()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // 根据ID获取活动数据
  const mockActivityDetail = getActivityDetail(params.id) || getActivityDetail('1')
  
  if (!mockActivityDetail) {
    return <div>活动不存在</div>
  }

  const roles = [
    { id: 'STUDENT', name: '学生', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'TEACHER', name: '教师', icon: User, color: 'bg-green-500' },
    { id: 'GROUP_LEADER', name: '教师组长', icon: UserCheck, color: 'bg-purple-500' },
    { id: 'PRINCIPAL', name: '校长', icon: Crown, color: 'bg-yellow-500' }
  ]

  const currentRoleInfo = roles.find(role => role.id === currentRole)
  
  // 检查用户是否有权限编辑/删除活动
  const canEditActivity = () => {
    const currentUserId = `${currentRole.toLowerCase()}-1` // 模拟当前用户ID
    if (currentRole === 'GROUP_LEADER' || currentRole === 'PRINCIPAL') {
      return true // 组长和校长可以编辑/删除任何活动
    }
    if (currentRole === 'TEACHER') {
      return mockActivityDetail.createdBy === currentUserId // 教师只能编辑/删除自己的活动
    }
    return false
  }

  // 处理删除活动
  const handleDeleteActivity = () => {
    const success = deleteActivity(params.id)
    if (success) {
      setShowDeleteConfirm(false)
      router.push('/activities')
    } else {
      // 可以添加错误提示
    }
  }
  
  // 处理多个类别
  const primaryCategory = mockActivityDetail.categories[0]
  const primaryCategoryInfo = categoryMap[primaryCategory as keyof typeof categoryMap]
  const allCategories = mockActivityDetail.categories.map(cat => categoryMap[cat as keyof typeof categoryMap])

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 智能返回按钮 */}
        <div className="mb-6">
          <Link 
            href={lastPage === '/plans' ? '/plans' : '/activities'} 
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {lastPage === '/plans' ? '返回活动计划' : '返回活动广场'}
          </Link>
        </div>

        {/* 活动封面 - 暗色蒙版背景 */}
        <div className="mb-8">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            {/* 背景图片 */}
            <div 
              className="aspect-[21/9] relative bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${mockActivityDetail.coverImage})`,
                backgroundPosition: 'center center'
              }}
            >
              {/* 蒙版 */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              
              {/* 内容 */}
              <div className="relative h-full flex flex-col lg:flex-row items-start justify-between p-4 lg:p-8">
                {/* 左侧：图标、名称和分类 */}
                <div className="flex items-center space-x-4 lg:space-x-6 mb-6 lg:mb-0">
                  <div className={`${primaryCategoryInfo.color} w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-lg`}>
                    <primaryCategoryInfo.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">{mockActivityDetail.title}</h1>
                    <div className="flex items-center space-x-2 flex-wrap">
                      {allCategories.map((category, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <span className="text-base lg:text-lg text-gray-200">{category.name}</span>
                          <span className="text-xs lg:text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">
                            {category.short}
                          </span>
                          {index < allCategories.length - 1 && (
                            <span className="text-gray-400 mx-1">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 右侧：操作按钮 */}
                <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 lg:mt-auto">
                  {currentRole === 'STUDENT' && (
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg">
                      参与活动
                    </button>
                  )}
                  {currentRole === 'TEACHER' && (
                    <>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg">
                        参与活动
                      </button>
                      {canEditActivity() && (
                        <>
                          <button 
                            onClick={() => router.push(`/activities/edit/${params.id}`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                          >
                            编辑活动
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                          >
                            删除活动
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {currentRole === 'GROUP_LEADER' && (
                    <>
                      {canEditActivity() && (
                        <>
                          <button 
                            onClick={() => router.push(`/activities/edit/${params.id}`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                          >
                            编辑活动
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                          >
                            删除活动
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {currentRole === 'PRINCIPAL' && (
                    <>
                      {canEditActivity() && (
                        <>
                          <button 
                            onClick={() => router.push(`/activities/edit/${params.id}`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                          >
                            编辑活动
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                          >
                            删除活动
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 活动基本信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">活动信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">主办单位</p>
                    <p className="font-medium text-gray-900">{mockActivityDetail.organizer}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`${primaryCategoryInfo.color} p-1 rounded-full mr-3`}>
                    <primaryCategoryInfo.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">活动类型</p>
                    <div className="flex items-center space-x-1 flex-wrap">
                      {allCategories.map((category, index) => (
                        <span key={index} className="font-medium text-gray-900">
                          {category.name} ({category.short})
                          {index < allCategories.length - 1 && <span className="text-gray-400 mx-1">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">参与年级</p>
                    <p className="font-medium text-gray-900">{mockActivityDetail.grades.join('、')}</p>
                  </div>
                </div>
                {mockActivityDetail.classes && mockActivityDetail.classes.length > 0 && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">参与班级</p>
                      <p className="font-medium text-gray-900">{mockActivityDetail.classes.join('、')}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">负责老师</p>
                    <p className="font-medium text-gray-900">{mockActivityDetail.responsibleTeacher}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 活动简介 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">活动简介</h2>
              <p className="text-gray-700 leading-relaxed">{mockActivityDetail.description}</p>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 活动详情卡片 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">活动详情</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">活动时间</p>
                    <p className="font-medium text-gray-900">
                      {mockActivityDetail.startTime} - {mockActivityDetail.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">活动地点</p>
                    <p className="font-medium text-gray-900">{mockActivityDetail.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">参与人数</p>
                    <p className="font-medium text-gray-900">
                      {mockActivityDetail.participants}/{mockActivityDetail.maxParticipants} 人
                    </p>
                  </div>
                </div>
                {mockActivityDetail.activityDirection && (
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">活动方向</p>
                      <p className="font-medium text-gray-900">{mockActivityDetail.activityDirection}</p>
                    </div>
                  </div>
                )}
                {mockActivityDetail.activityPlan && (
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">所属计划</p>
                      <p className="font-medium text-gray-900">{mockActivityDetail.activityPlan}</p>
                    </div>
                  </div>
                )}
                {mockActivityDetail.requireRegistration !== undefined && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">报名要求</p>
                      <p className="font-medium text-gray-900">
                        {mockActivityDetail.requireRegistration ? '需要报名' : '无需报名'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 综评观测点 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">综评观测点</h3>
              <div className="space-y-3">
                {mockActivityDetail.observationPoints?.map((pointId, index) => {
                  const point = getObservationPointById(pointId)
                  if (!point) return null
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{point.name}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {point.subcategory}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{point.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* 活动流程 - 全宽度 */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">活动流程</h2>
            <div className="space-y-6">
              {mockActivityDetail.processSteps?.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-lg font-semibold">
                      {step.order + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {step.type === 'content' && '图文内容'}
                        {step.type === 'checkin' && '签到环节'}
                        {step.type === 'video' && '视频学习'}
                        {step.type === 'questionnaire' && '问卷调查'}
                        {step.type === 'task' && '任务提交'}
                      </span>
                    </div>
                    {step.type === 'content' && (
                      <div className="text-gray-700 text-base leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: step.data.content || '' }} />
                      </div>
                    )}
                    {step.type === 'checkin' && (
                      <div className="text-gray-700 text-base leading-relaxed">
                        <p className="mb-4">{step.data.description}</p>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200">
                          立即签到
                        </button>
                      </div>
                    )}
                    {step.type === 'video' && (
                      <div className="text-gray-700 text-base leading-relaxed">
                        <p className="mb-4">视频学习环节</p>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200">
                          观看视频
                        </button>
                      </div>
                    )}
                    {step.type === 'questionnaire' && (
                      <div className="text-gray-700 text-base leading-relaxed">
                        <p className="mb-4">{step.data.description}</p>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200">
                          开始答题
                        </button>
                      </div>
                    )}
                    {step.type === 'task' && (
                      <div className="text-gray-700 text-base leading-relaxed">
                        <div className="mb-4" dangerouslySetInnerHTML={{ __html: step.data.requirements || '' }} />
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200">
                          提交任务
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* 删除确认模态框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">确认删除活动</h3>
                <p className="text-gray-600 mb-6">
                  您确定要删除活动"{mockActivityDetail.title}"吗？此操作无法撤销。
                </p>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDeleteActivity}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
