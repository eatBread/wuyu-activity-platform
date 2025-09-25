import { Heart, BookOpen, UserCheck, Palette, Globe } from 'lucide-react'

// 类别映射
export const categoryMap = {
  'MORAL_EDUCATION': { name: '思想品德', short: '德', icon: Heart, color: 'bg-red-500' },
  'ACADEMIC_LEVEL': { name: '学业水平', short: '智', icon: BookOpen, color: 'bg-blue-500' },
  'PHYSICAL_HEALTH': { name: '身心健康', short: '体', icon: UserCheck, color: 'bg-green-500' },
  'ARTISTIC_LITERACY': { name: '艺术素养', short: '美', icon: Palette, color: 'bg-purple-500' },
  'SOCIAL_PRACTICE': { name: '社会实践', short: '劳', icon: Globe, color: 'bg-orange-500' }
}


// 状态映射
export const statusMap = {
  'UPCOMING': '即将开始',
  'ONGOING': '进行中',
  'COMPLETED': '已完成',
  'CANCELLED': '已取消'
}

// 综合素质评价观测点
export const observationPoints = [
  // 思想品德
  { id: '1', category: 'MORAL_EDUCATION', subcategory: '思想素质', name: '观测点1', description: '积极参加升国旗等爱国主义仪式和法治教育、国防教育等活动，参观爱国主义教育基地，出勤率100%。' },
  { id: '2', category: 'MORAL_EDUCATION', subcategory: '品德发展', name: '观测点2', description: '担任班团队、社团等学生干部或在服务集体方面有突出表现，获得校级及以上优秀学生、优秀少先队员、优秀团员、优秀学生干部等德育类或综合类荣誉称号。' },
  { id: '3', category: 'MORAL_EDUCATION', subcategory: '品德发展', name: '观测点3', description: '参加公益活动、志愿服务活动、社区服务等累计24小时及以上。' },
  { id: '4', category: 'MORAL_EDUCATION', subcategory: '品德发展', name: '观测点4', description: '具有良好公民意识，无违法行为，未受到学校纪律处分，遵守社会公德，并积极影响他人。' },
  { id: '5', category: 'MORAL_EDUCATION', subcategory: '公民意识', name: '观测点5', description: '参与学习弘扬传统文化、了解世界文化的讲座、活动，或与境外友好学校交流2次及以上。' },
  
  // 学业水平
  { id: '6', category: 'ACADEMIC_LEVEL', subcategory: '学业成绩', name: '观测点6', description: '各科成绩达到合格及以上标准。' },
  { id: '7', category: 'ACADEMIC_LEVEL', subcategory: '学业潜力', name: '观测点7', description: '获得校级以上学习类奖励或荣誉称号。' },
  { id: '8', category: 'ACADEMIC_LEVEL', subcategory: '创新意识与能力', name: '观测点8', description: '研究性学习和小课题研究取得丰硕成果，在创新意识和创新能力上有突出表现。' },
  { id: '9', category: 'ACADEMIC_LEVEL', subcategory: '学业素养', name: '观测点9', description: '积极利用公共图书馆资源或学校图书资源，借阅科技与人文类书籍10册及以上，并撰写读书心得体会。' },
  { id: '10', category: 'ACADEMIC_LEVEL', subcategory: '学业素养', name: '观测点10', description: '撰写有利于自我成长的学习总结、制定具有可行性的学习计划、学生生涯规划书。' },
  
  // 身心健康
  { id: '11', category: 'PHYSICAL_HEALTH', subcategory: '体质状况', name: '观测点11', description: '《国家学生体质健康标准》达到良好以上标准。' },
  { id: '12', category: 'PHYSICAL_HEALTH', subcategory: '健康生活', name: '观测点12', description: '体育与健康课程出勤率达到100%。' },
  { id: '13', category: 'PHYSICAL_HEALTH', subcategory: '体育技能', name: '观测点13', description: '掌握2项及以上体育技能并积极参加学校运动会，或获得区级以上体育竞赛奖项。' },
  { id: '14', category: 'PHYSICAL_HEALTH', subcategory: '安全素养', name: '观测点14', description: '积极参加学校组织的心理健康教育、安全教育和校外安全实践活动，参加应急疏散演练2次及以上。' },
  { id: '15', category: 'PHYSICAL_HEALTH', subcategory: '心理健康', name: '观测点15', description: '沟通能力和合作能力较强，人际关系融洽。' },
  
  // 艺术素养
  { id: '16', category: 'ARTISTIC_LITERACY', subcategory: '艺术体验', name: '观测点16', description: '艺术课程学习的出勤率100%。' },
  { id: '17', category: 'ARTISTIC_LITERACY', subcategory: '艺术体验', name: '观测点17', description: '艺术课程学习任务完成率100%。' },
  { id: '18', category: 'ARTISTIC_LITERACY', subcategory: '艺术体验', name: '观测点18', description: '参加各类艺术活动3次及以上。' },
  { id: '19', category: 'ARTISTIC_LITERACY', subcategory: '艺术特长', name: '观测点19', description: '掌握1项艺术特长。' },
  { id: '20', category: 'ARTISTIC_LITERACY', subcategory: '艺术特长', name: '观测点20', description: '参加艺术兴趣小组、艺术社团，校外艺术实践或获得教育行政部门组织或认可的区级以上艺术类竞赛奖励或荣誉称号2次及以上。' },
  
  // 社会实践
  { id: '21', category: 'SOCIAL_PRACTICE', subcategory: '社会学习', name: '观测点21', description: '参与研学旅行或有学校组织的校外参观学习2次及以上。' },
  { id: '22', category: 'SOCIAL_PRACTICE', subcategory: '社会学习', name: '观测点22', description: '参与职业体验或社会调研1次及以上。' },
  { id: '23', category: 'SOCIAL_PRACTICE', subcategory: '劳动实践', name: '观测点23', description: '积极参加劳动活动，掌握基本的劳动技能，按要求完成校内值日，每周参加2次及以上的家务劳动。' },
  { id: '24', category: 'SOCIAL_PRACTICE', subcategory: '实践性学习', name: '观测点24', description: '参加综合实践主题活动、学科活动2次及以上。' },
  { id: '25', category: 'SOCIAL_PRACTICE', subcategory: '创新能力', name: '观测点25', description: '参与学校或教育行政部门举办、参与举办或者支持举办的各类科普教育、信息技术、科技创新实战探究及科技类学生交流竞赛活动、创客活动1次及以上。' }
]

// 根据活动类别获取对应的观测点
export const getObservationPointsByCategory = (categories: string[]) => {
  if (!categories || categories.length === 0) return observationPoints
  return observationPoints.filter(point => categories.includes(point.category))
}

// 根据观测点ID获取观测点信息
export const getObservationPointById = (id: string) => {
  return observationPoints.find(point => point.id === id)
}

// 模拟活动数据（从活动列表页面同步）
export const mockActivities = [
  {
    id: '1',
    title: '文明班级评比',
    description: '通过班级文明行为评比，培养学生良好的品德修养和集体荣誉感，营造积极向上的班级氛围',
    categories: ['MORAL_EDUCATION'],
    startDate: '2024-03-10',
    endDate: '2024-03-31',
    location: '各班级教室',
    maxParticipants: 500,
    status: 'ONGOING',
    creator: '王德育老师',
    createdBy: 'teacher-1', // 创建者用户ID
    participants: 450,
    coverImage: '/images/activities/2.png',
    activityDirection: '习惯养成类',
    activityPlan: '2024-2025学年下学期思想品德活动计划',
    observationPoints: ['2', '3', '4'], // 观测点2、3、4
    processSteps: [
      {
        id: 'step_1',
        type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
        title: '活动介绍',
        order: 0,
        data: {
          content: '<p>欢迎参加文明班级评比活动！本次活动旨在培养同学们的文明行为习惯，营造良好的班级氛围。</p>',
          images: []
        }
      },
      {
        id: 'step_2',
        type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
        title: '文明班级评比签到',
        order: 1,
        data: {
          description: '请同学们按时签到，确认参与文明班级评比活动'
        }
      },
      {
        id: 'step_3',
        type: 'questionnaire' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
        title: '文明行为自评',
        order: 2,
        data: {
          title: '文明行为自评问卷',
          description: '请同学们根据自身表现进行文明行为自评',
          questions: [
            {
              id: 'q_1',
              type: 'single',
              title: '你是否经常使用文明用语？',
              options: ['总是', '经常', '有时', '很少'],
              placeholder: ''
            },
            {
              id: 'q_2',
              type: 'single',
              title: '你是否主动维护班级卫生？',
              options: ['总是', '经常', '有时', '很少'],
              placeholder: ''
            }
          ]
        }
      }
    ]
  },
  {
    id: '2',
    title: '班级拔河比赛',
    description: '通过班级拔河比赛，培养学生的团队合作精神、集体荣誉感和体育竞技能力，增强班级凝聚力',
    categories: ['PHYSICAL_HEALTH'],
    startDate: '2024-04-15',
    endDate: '2024-04-15',
    location: '学校操场',
    maxParticipants: 200,
    status: 'UPCOMING',
    creator: '李体育老师',
    createdBy: 'teacher-2', // 创建者用户ID
    participants: 0,
    coverImage: '/images/activities/4.png',
    activityDirection: '常规活动',
    activityPlan: '2024-2025学年下学期身心健康活动计划',
    observationPoints: ['11', '12', '13'], // 观测点11、12、13
    processSteps: [
      {
        id: 'step_1',
        type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
        title: '比赛规则介绍',
        order: 0,
        data: {
          content: '<p>欢迎参加班级拔河比赛！比赛规则如下：</p><ul><li>每班派出10名同学参赛</li><li>比赛采用三局两胜制</li><li>注意安全，听从裁判指挥</li></ul>',
          images: []
        }
      },
      {
        id: 'step_2',
        type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
        title: '班级拔河比赛签到',
        order: 1,
        data: {
          description: '请参赛同学按时签到，确认参与班级拔河比赛'
        }
      },
      {
        id: 'step_3',
        type: 'video' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
        title: '拔河技巧教学',
        order: 2,
        data: {
          title: '拔河技巧教学视频',
          description: '观看拔河技巧教学视频，学习正确的拔河姿势和技巧',
          videoFile: null
        }
      },
      {
        id: 'step_4',
        type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
        title: '比赛总结',
        order: 3,
        data: {
          title: '比赛总结任务',
          type: 'text',
          requirements: '请同学们写一份比赛总结，包括比赛感受、团队合作体验等',
          images: []
        }
      }
    ]
  }
]

// 根据实际活动数据动态生成活动计划
export const getPlansWithActualActivities = (semester: string = '2024-2025-2') => {
  const semesterData = mockPlans[semester as keyof typeof mockPlans]
  
  if (!semesterData) return null
  
  // 创建计划数据的深拷贝
  const plansWithActivities = JSON.parse(JSON.stringify(semesterData))
  
  // 清空所有活动，然后根据实际活动数据填充
  Object.values(plansWithActivities.plans).forEach((plan: any) => {
    plan.directions.forEach((direction: any) => {
      direction.activities = []
    })
  })
  
  // 根据实际活动数据填充计划
  mockActivities.forEach(activity => {
    // 找到对应的计划
    const plan = plansWithActivities.plans[activity.categories[0] as keyof typeof plansWithActivities.plans]
    if (plan) {
      // 找到对应的方向
      const direction = plan.directions.find((dir: any) => dir.name === activity.activityDirection)
      if (direction) {
        direction.activities.push({
          id: activity.id,
          name: activity.title,
          status: activity.status
        })
      }
    }
  })
  
  return plansWithActivities
}

// 模拟活动计划数据
export const mockPlans = {
  '2024-2025-1': {
    semester: '2024-2025学年上学期',
    plans: {
      'MORAL_EDUCATION': {
        category: 'MORAL_EDUCATION',
        title: '2024-2025学年上学期思想品德活动计划',
        directions: []
      },
      'ACADEMIC_LEVEL': {
        category: 'ACADEMIC_LEVEL',
        title: '2024-2025学年上学期学业水平活动计划',
        directions: []
      },
      'PHYSICAL_HEALTH': {
        category: 'PHYSICAL_HEALTH',
        title: '2024-2025学年上学期身心健康活动计划',
        directions: []
      },
      'ARTISTIC_LITERACY': {
        category: 'ARTISTIC_LITERACY',
        title: '2024-2025学年上学期艺术素养活动计划',
        directions: []
      },
      'SOCIAL_PRACTICE': {
        category: 'SOCIAL_PRACTICE',
        title: '2024-2025学年上学期社会实践活动计划',
        directions: []
      }
    }
  },
  '2024-2025-2': {
    semester: '2024-2025学年下学期',
    plans: {
      'MORAL_EDUCATION': {
        category: 'MORAL_EDUCATION',
        title: '2024-2025学年下学期思想品德活动计划',
        directions: [
          {
            id: '1',
            name: '主题教育类',
            activities: []
          },
          {
            id: '2',
            name: '习惯养成类',
            activities: [
              { id: '1', name: '文明班级评比', status: 'ONGOING' }
            ]
          },
          {
            id: '3',
            name: '社会实践类',
            activities: []
          }
        ]
      },
      'ACADEMIC_LEVEL': {
        category: 'ACADEMIC_LEVEL',
        title: '2024-2025学年下学期学业水平活动计划',
        directions: [
          {
            id: '4',
            name: '学科拓展类',
            activities: []
          },
          {
            id: '5',
            name: '科技创新类',
            activities: []
          },
          {
            id: '6',
            name: '阅读素养类',
            activities: []
          }
        ]
      },
      'PHYSICAL_HEALTH': {
        category: 'PHYSICAL_HEALTH',
        title: '2024-2025学年下学期身心健康活动计划',
        directions: [
          {
            id: '7',
            name: '常规活动',
            activities: []
          },
          {
            id: '8',
            name: '专项训练',
            activities: []
          },
          {
            id: '9',
            name: '健康管理',
            activities: []
          }
        ]
      },
      'ARTISTIC_LITERACY': {
        category: 'ARTISTIC_LITERACY',
        title: '2024-2025学年下学期艺术素养活动计划',
        directions: [
          {
            id: '10',
            name: '艺术实践',
            activities: []
          },
          {
            id: '11',
            name: '文化体验',
            activities: []
          },
          {
            id: '12',
            name: '创意表达',
            activities: []
          }
        ]
      },
      'SOCIAL_PRACTICE': {
        category: 'SOCIAL_PRACTICE',
        title: '2024-2025学年下学期社会实践活动计划',
        directions: [
          {
            id: '13',
            name: '校园劳动',
            activities: []
          },
          {
            id: '14',
            name: '生活技能',
            activities: []
          },
          {
            id: '15',
            name: '职业体验',
            activities: []
          }
        ]
      }
    }
  }
}

// 从活动计划数据生成活动计划选择数据
export const getActivityPlansForSelection = (semester: string = '2024-2025-2') => {
  const semesterData = mockPlans[semester as keyof typeof mockPlans]
  
  if (!semesterData) return {}
  
  const activityPlans: any = {}
  
  Object.entries(semesterData.plans).forEach(([category, planData]) => {
    activityPlans[category] = [
      {
        id: `${category}-plan-1`,
        name: planData.title,
        directions: planData.directions.map((dir: any) => dir.name)
      }
    ]
  })
  
  return activityPlans
}

// 添加新的活动计划
export const addNewPlan = (planData: any) => {
  const currentSemester = '2024-2025-1'
  const semesterData = mockPlans[currentSemester]
  
  if (!semesterData) {
    return false
  }
  
  // 添加新计划
  (semesterData as any).plans[planData.category] = {
    category: planData.category,
    title: planData.title,
    directions: planData.directions.map((dir: any) => ({
      id: dir.id,
      name: dir.name,
      activities: dir.activities.map((act: any) => ({
        id: act.id,
        name: act.name,
        status: 'PLANNED'
      }))
    }))
  }
  
  return true
}

// 添加新活动到mock数据
export const addNewActivity = (activityData: any, createdBy: string) => {
  try {
    // 生成新的活动ID
    const newId = (mockActivities.length + 1).toString()
    
    // 创建新活动对象
    const newActivity = {
      id: newId,
      title: activityData.title,
      description: activityData.description,
      categories: activityData.categories,
      startDate: activityData.startDate,
      endDate: activityData.endDate,
      location: activityData.location,
      maxParticipants: activityData.maxParticipants,
      status: 'UPCOMING' as const,
      creator: activityData.responsibleTeacher,
      createdBy: createdBy, // 创建者用户ID
      participants: 0,
      coverImage: activityData.coverImage || '/images/activities/default.png',
      activityDirection: activityData.activityDirection || '',
      activityPlan: activityData.activityPlan || '',
      processSteps: activityData.processSteps !== undefined ? activityData.processSteps : [],
      observationPoints: activityData.observationPoints !== undefined ? activityData.observationPoints : []
    }
    
    // 添加到活动列表
    mockActivities.push(newActivity)
    
    console.log('新活动已添加:', newActivity)
    return true
  } catch (error) {
    console.error('添加活动失败:', error)
    return false
  }
}

// 更新活动
export const updateActivity = (activityId: string, activityData: any) => {
  try {
    const index = mockActivities.findIndex(activity => activity.id === activityId)
    if (index === -1) {
      console.error('活动不存在:', activityId)
      return false
    }
    
    // 更新活动数据
    mockActivities[index] = {
      ...mockActivities[index],
      title: activityData.title,
      description: activityData.description,
      categories: activityData.categories,
      startDate: activityData.startDate,
      endDate: activityData.endDate,
      location: activityData.location,
      maxParticipants: activityData.maxParticipants,
      creator: activityData.responsibleTeacher,
      coverImage: activityData.coverImage || mockActivities[index].coverImage,
      activityDirection: activityData.activityDirection || '',
      activityPlan: activityData.activityPlan || '',
      processSteps: activityData.processSteps !== undefined ? activityData.processSteps : (mockActivities[index].processSteps || []),
      observationPoints: activityData.observationPoints !== undefined ? activityData.observationPoints : (mockActivities[index].observationPoints || [])
    }
    
    console.log('活动已更新:', mockActivities[index])
    return true
  } catch (error) {
    console.error('更新活动失败:', error)
    return false
  }
}

// 删除活动
export const deleteActivity = (activityId: string) => {
  try {
    const index = mockActivities.findIndex(activity => activity.id === activityId)
    if (index === -1) {
      console.error('活动不存在:', activityId)
      return false
    }
    
    const deletedActivity = mockActivities.splice(index, 1)[0]
    console.log('活动已删除:', deletedActivity)
    return true
  } catch (error) {
    console.error('删除活动失败:', error)
    return false
  }
}

// 根据ID获取活动
export const getActivityById = (activityId: string) => {
  return mockActivities.find(activity => activity.id === activityId)
}

// 活动模板数据结构
export interface ActivityTemplate {
  id: string
  name: string
  description: string
  categories: string[]
  coverImage: string
  createdBy: string
  createdAt: string
  // 模板内容
  templateData: {
    title: string
    description: string
    organizer: string
    grades: string[]
    classes: string[]
    categories: string[]
    location: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    maxParticipants: number
    responsibleTeacher: string
    requireRegistration: boolean
    observationPoints: string[]
    processSteps: Array<{
      id: string
      type: 'content' | 'checkin' | 'video' | 'questionnaire' | 'task'
      title: string
      order: number
      data: any
    }>
    selectedPlans: Array<{planId: string, planName: string, direction: string}>
  }
}

// 示例模板数据
export const mockTemplates: ActivityTemplate[] = [
  {
    id: 'template-1',
    name: '体育竞赛活动模板',
    description: '适用于各类体育竞赛活动，包含比赛介绍、签到、规则说明、技巧教学和总结提交等环节',
    categories: ['PHYSICAL_HEALTH'],
    coverImage: '/images/activities/4.png',
    createdBy: 'system',
    createdAt: '2024-01-15',
    templateData: {
      title: '体育竞赛活动',
      description: '通过体育竞赛活动，培养学生的团队合作精神、集体荣誉感和体育竞技能力，增强班级凝聚力',
      organizer: '广州华颖外国语学校',
      grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classes: [],
      categories: ['PHYSICAL_HEALTH'],
      location: '学校操场',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '18:00',
      maxParticipants: 200,
      responsibleTeacher: '',
      requireRegistration: true,
      observationPoints: ['13'], // 体育技能
      processSteps: [
        {
          id: 'step1',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '比赛介绍',
          order: 0,
          data: {
            content: '<h3>体育竞赛活动介绍</h3><p>欢迎参加体育竞赛活动！这是一项能够有效培养学生的团队合作精神、集体荣誉感和体育竞技能力的活动。</p><p><strong>活动目标：</strong></p><ul><li>增强班级凝聚力和团队合作精神</li><li>提高学生的体育技能和身体素质</li><li>培养集体荣誉感和竞争意识</li><li>促进班级间的友谊交流</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '体育竞赛活动签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与体育竞赛活动'
          }
        },
        {
          id: 'step3',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '比赛规则说明',
          order: 2,
          data: {
            content: '<h3>比赛规则</h3><h4>一、参赛要求</h4><ul><li>参赛学生必须身体健康，无心脏病等疾病</li><li>比赛前需进行充分热身</li><li>遵守比赛纪律，服从裁判指挥</li></ul><h4>二、比赛规则</h4><ul><li>比赛采用公平竞争原则</li><li>比赛过程中不得恶意犯规</li><li>尊重对手，友谊第一，比赛第二</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'video' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '技巧教学',
          order: 3,
          data: {
            title: '体育技巧教学视频',
            description: '观看体育技巧教学视频，学习正确的运动姿势和技巧'
          }
        },
        {
          id: 'step5',
          type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '活动总结提交',
          order: 4,
          data: {
            title: '活动总结提交任务',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请各班级在活动结束后提交活动总结，内容包括：</p><ol><li>活动过程中的感受和体会</li><li>团队合作的重要性认识</li><li>对体育竞技精神的理解</li><li>对班级凝聚力的提升作用</li></ol><p>字数要求：不少于300字</p>',
            images: []
          }
        }
      ],
      selectedPlans: []
    }
  },
  {
    id: 'template-2',
    name: '德育教育活动模板',
    description: '适用于思想品德教育活动，包含活动介绍、签到、主题教育、实践体验和反思总结等环节',
    categories: ['MORAL_EDUCATION'],
    coverImage: '/images/activities/2.png',
    createdBy: 'system',
    createdAt: '2024-01-20',
    templateData: {
      title: '德育教育活动',
      description: '通过德育教育活动，培养学生良好的品德修养和集体荣誉感，营造积极向上的班级氛围',
      organizer: '广州华颖外国语学校',
      grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classes: [],
      categories: ['MORAL_EDUCATION'],
      location: '各班级教室',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '18:00',
      maxParticipants: 500,
      responsibleTeacher: '',
      requireRegistration: false,
      observationPoints: ['2', '3', '4'], // 品德发展相关观测点
      processSteps: [
        {
          id: 'step1',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '活动介绍',
          order: 0,
          data: {
            content: '<h3>德育教育活动介绍</h3><p>欢迎参加德育教育活动！本次活动旨在培养学生良好的品德修养和集体荣誉感，营造积极向上的班级氛围。</p><p><strong>活动目标：</strong></p><ul><li>培养学生的道德品质和公民意识</li><li>增强集体荣誉感和责任感</li><li>提高学生的自我管理能力</li><li>促进班级和谐发展</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '德育教育活动签到',
          order: 1,
          data: {
            description: '请同学们进行签到确认参与德育教育活动'
          }
        },
        {
          id: 'step3',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '主题教育',
          order: 2,
          data: {
            content: '<h3>主题教育内容</h3><h4>一、品德修养</h4><ul><li>诚实守信，言行一致</li><li>尊重他人，礼貌待人</li><li>团结友爱，互帮互助</li></ul><h4>二、集体荣誉</h4><ul><li>维护班级形象</li><li>积极参与集体活动</li><li>为班级争光添彩</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'questionnaire' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '品德认知问卷',
          order: 3,
          data: {
            title: '品德认知问卷',
            description: '请认真填写以下问卷，了解自己的品德认知水平',
            questions: [
              {
                id: 'q1',
                type: 'single',
                title: '你认为最重要的品德是什么？',
                options: ['诚实', '勇敢', '善良', '勤奋'],
                placeholder: ''
              },
              {
                id: 'q2',
                type: 'multiple',
                title: '以下哪些行为体现了良好的品德？',
                options: ['帮助同学', '遵守纪律', '爱护公物', '尊敬师长'],
                placeholder: ''
              },
              {
                id: 'q3',
                type: 'text',
                title: '请描述一次你帮助他人的经历',
                options: [],
                placeholder: '请详细描述你的经历和感受...'
              }
            ]
          }
        },
        {
          id: 'step5',
          type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '反思总结',
          order: 4,
          data: {
            title: '反思总结任务',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请结合本次德育教育活动，写一份反思总结，内容包括：</p><ol><li>对品德修养的新认识</li><li>自己在活动中的表现和收获</li><li>今后如何更好地践行良好品德</li><li>对班级建设的建议</li></ol><p>字数要求：不少于400字</p>',
            images: []
          }
        }
      ],
      selectedPlans: []
    }
  },
  {
    id: 'template-3',
    name: 'AI科普黑板报',
    description: '适用于学业水平类AI科普教育活动，包含科普介绍、签到、AI知识学习、实践体验和成果展示等环节',
    categories: ['ACADEMIC_LEVEL'],
    coverImage: '/images/activities/3.png',
    createdBy: 'system',
    createdAt: '2024-01-25',
    templateData: {
      title: 'AI科普黑板报',
      description: '通过AI科普黑板报活动，让学生了解人工智能的基本概念和应用，培养科学思维和创新意识，提升学业水平',
      organizer: '广州华颖外国语学校',
      grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classes: [],
      categories: ['ACADEMIC_LEVEL'],
      location: '各班级教室',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '18:00',
      maxParticipants: 500,
      responsibleTeacher: '',
      requireRegistration: true,
      observationPoints: ['8'], // 创新意识与能力
      processSteps: [
        {
          id: 'step1',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: 'AI科普介绍',
          order: 0,
          data: {
            content: '<h3>AI科普黑板报活动介绍</h3><p>欢迎参加AI科普黑板报活动！这是一项能够有效提升学生科学素养和创新意识的活动。</p><p><strong>活动目标：</strong></p><ul><li>了解人工智能的基本概念和发展历程</li><li>认识AI在日常生活中的应用</li><li>培养科学思维和创新意识</li><li>提升信息素养和学业水平</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: 'AI科普活动签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与AI科普黑板报活动'
          }
        },
        {
          id: 'step3',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: 'AI基础知识学习',
          order: 2,
          data: {
            content: '<h3>AI基础知识</h3><h4>一、什么是人工智能</h4><ul><li>人工智能（AI）是让机器模拟人类智能的技术</li><li>包括机器学习、深度学习、自然语言处理等</li><li>目标是让机器能够像人类一样思考和决策</li></ul><h4>二、AI的应用领域</h4><ul><li>智能语音助手：Siri、小爱同学等</li><li>图像识别：人脸识别、物体识别等</li><li>自动驾驶：智能汽车技术</li><li>医疗诊断：AI辅助医生诊断疾病</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'video' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: 'AI科普视频',
          order: 3,
          data: {
            title: 'AI科普教育视频',
            description: '观看AI科普教育视频，深入了解人工智能的发展和应用'
          }
        },
        {
          id: 'step5',
          type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '黑板报制作任务',
          order: 4,
          data: {
            title: 'AI科普黑板报制作',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请各班级制作AI科普主题黑板报，内容包括：</p><ol><li>AI的基本概念和定义</li><li>AI的发展历程和重要里程碑</li><li>AI在生活中的实际应用案例</li><li>对AI未来发展的思考和展望</li></ol><p>要求：图文并茂，内容准确，设计美观，体现创新思维</p>',
            images: []
          }
        }
      ],
      selectedPlans: []
    }
  },
  {
    id: 'template-4',
    name: '班级合唱比赛',
    description: '适用于艺术素养类合唱比赛活动，包含比赛介绍、签到、音乐学习、排练指导和比赛展示等环节',
    categories: ['ARTISTIC_LITERACY'],
    coverImage: '/images/activities/6.png',
    createdBy: 'system',
    createdAt: '2024-01-30',
    templateData: {
      title: '班级合唱比赛',
      description: '通过班级合唱比赛活动，培养学生的音乐素养、团队合作精神和艺术表现能力，提升艺术素养水平',
      organizer: '广州华颖外国语学校',
      grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classes: [],
      categories: ['ARTISTIC_LITERACY'],
      location: '学校礼堂',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '17:00',
      maxParticipants: 300,
      responsibleTeacher: '',
      requireRegistration: true,
      observationPoints: ['19'], // 艺术特长
      processSteps: [
        {
          id: 'step1',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '合唱比赛介绍',
          order: 0,
          data: {
            content: '<h3>班级合唱比赛介绍</h3><p>欢迎参加班级合唱比赛！这是一项能够有效提升学生艺术素养和团队合作精神的活动。</p><p><strong>活动目标：</strong></p><ul><li>培养学生的音乐素养和艺术表现能力</li><li>增强班级凝聚力和团队合作精神</li><li>提升学生的艺术鉴赏能力和审美水平</li><li>营造积极向上的校园文化氛围</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '合唱比赛签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与班级合唱比赛'
          }
        },
        {
          id: 'step3',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '合唱基础知识',
          order: 2,
          data: {
            content: '<h3>合唱基础知识</h3><h4>一、合唱的基本要求</h4><ul><li>音准：准确把握音高，不跑调</li><li>节奏：严格按照节拍演唱</li><li>音色：统一和谐的声音</li><li>表情：根据歌曲内容表达情感</li></ul><h4>二、合唱技巧</h4><ul><li>呼吸：掌握正确的呼吸方法</li><li>发声：运用科学的发声技巧</li><li>配合：注意声部间的协调配合</li><li>指挥：跟随指挥的手势和表情</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'video' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '合唱教学视频',
          order: 3,
          data: {
            title: '合唱技巧教学视频',
            description: '观看合唱技巧教学视频，学习正确的合唱方法和技巧'
          }
        },
        {
          id: 'step5',
          type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '合唱排练任务',
          order: 4,
          data: {
            title: '班级合唱排练',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请各班级进行合唱排练，要求：</p><ol><li>选择适合班级演唱的歌曲</li><li>进行声部分配和角色安排</li><li>练习音准、节奏和音色统一</li><li>准备比赛服装和道具</li><li>进行多次彩排，确保演出效果</li></ol><p>比赛评分标准：音准30%、节奏20%、音色20%、表现力20%、服装道具10%</p>',
            images: []
          }
        }
      ],
      selectedPlans: []
    }
  },
  {
    id: 'template-5',
    name: '校企合作职业见习日',
    description: '适用于社会实践类职业体验活动，包含见习介绍、签到、企业参观、职业体验和总结分享等环节',
    categories: ['SOCIAL_PRACTICE'],
    coverImage: '/images/activities/5.png',
    createdBy: 'system',
    createdAt: '2024-02-01',
    templateData: {
      title: '校企合作职业见习日',
      description: '通过校企合作职业见习日活动，让学生深入了解不同职业的工作内容和要求，培养职业规划意识和社会实践能力',
      organizer: '广州华颖外国语学校',
      grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classes: [],
      categories: ['SOCIAL_PRACTICE'],
      location: '合作企业',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '16:00',
      maxParticipants: 100,
      responsibleTeacher: '',
      requireRegistration: true,
      observationPoints: ['22'], // 职业体验或社会调研
      processSteps: [
        {
          id: 'step1',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '职业见习介绍',
          order: 0,
          data: {
            content: '<h3>校企合作职业见习日活动介绍</h3><p>欢迎参加校企合作职业见习日活动！这是一项能够有效提升学生社会实践能力和职业规划意识的活动。</p><p><strong>活动目标：</strong></p><ul><li>了解不同职业的工作内容和职业要求</li><li>体验真实的工作环境和职业氛围</li><li>培养职业规划意识和职业素养</li><li>增强社会实践能力和团队合作精神</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '职业见习签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与校企合作职业见习日活动'
          }
        },
        {
          id: 'step3',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '企业文化和职业介绍',
          order: 2,
          data: {
            content: '<h3>企业文化和职业介绍</h3><h4>一、企业文化</h4><ul><li>企业使命、愿景和价值观</li><li>企业组织架构和部门设置</li><li>企业的发展历程和成就</li><li>企业的社会责任和贡献</li></ul><h4>二、职业介绍</h4><ul><li>不同岗位的职责和要求</li><li>职业发展路径和晋升机会</li><li>所需技能和知识结构</li><li>工作环境和福利待遇</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'video' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '职业体验视频',
          order: 3,
          data: {
            title: '职业体验教育视频',
            description: '观看职业体验教育视频，了解不同职业的工作内容和要求'
          }
        },
        {
          id: 'step5',
          type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '职业体验总结',
          order: 4,
          data: {
            title: '职业体验总结分享',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请各班级在职业见习结束后提交体验总结，内容包括：</p><ol><li>对参观企业的整体印象和感受</li><li>对不同职业的了解和认识</li><li>对自己未来职业规划的思考</li><li>对职业素养和技能要求的理解</li><li>对校企合作活动的建议和意见</li></ol><p>字数要求：不少于500字，要求真实记录，体现思考深度</p>',
            images: []
          }
        }
      ],
      selectedPlans: []
    }
  },
  {
    id: 'template-6',
    name: '校园微电影大赛',
    description: '适用于艺术素养类微电影创作活动，包含大赛介绍、签到、电影知识学习、创作指导和作品展示等环节',
    categories: ['ARTISTIC_LITERACY'],
    coverImage: '/images/activities/7.png',
    createdBy: 'system',
    createdAt: '2024-02-05',
    templateData: {
      title: '校园微电影大赛',
      description: '通过校园微电影大赛活动，培养学生的艺术创作能力、团队合作精神和审美素养，提升艺术表现水平',
      organizer: '广州华颖外国语学校',
      grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classes: [],
      categories: ['ARTISTIC_LITERACY'],
      location: '学校多媒体教室',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '18:00',
      maxParticipants: 200,
      responsibleTeacher: '',
      requireRegistration: true,
      observationPoints: ['20'], // 艺术特长
      processSteps: [
        {
          id: 'step1',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '微电影大赛介绍',
          order: 0,
          data: {
            content: '<h3>校园微电影大赛介绍</h3><p>欢迎参加校园微电影大赛！这是一项能够有效提升学生艺术创作能力和审美素养的活动。</p><p><strong>活动目标：</strong></p><ul><li>培养学生的艺术创作能力和审美素养</li><li>提升学生的团队合作精神和沟通能力</li><li>增强学生的创新思维和表达能力</li><li>营造积极向上的校园文化氛围</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '微电影大赛签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与校园微电影大赛'
          }
        },
        {
          id: 'step3',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '微电影创作知识',
          order: 2,
          data: {
            content: '<h3>微电影创作知识</h3><h4>一、微电影基本要素</h4><ul><li>剧本：故事结构、人物设定、情节发展</li><li>拍摄：镜头语言、画面构图、光线运用</li><li>剪辑：节奏控制、转场效果、音画同步</li><li>音效：背景音乐、音效设计、配音技巧</li></ul><h4>二、创作技巧</h4><ul><li>选题：贴近生活、有教育意义</li><li>叙事：结构清晰、逻辑合理</li><li>表现：情感真挚、画面美观</li><li>创新：形式新颖、内容独特</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'video' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '微电影创作教学',
          order: 3,
          data: {
            title: '微电影创作教学视频',
            description: '观看微电影创作教学视频，学习专业的创作技巧和方法'
          }
        },
        {
          id: 'step5',
          type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '微电影创作任务',
          order: 4,
          data: {
            title: '校园微电影创作',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请各班级创作校园主题微电影，要求：</p><ol><li>时长：3-8分钟</li><li>主题：校园生活、学习成长、友谊亲情等</li><li>内容：积极向上，有教育意义</li><li>技术：画面清晰，音质良好，剪辑流畅</li><li>创新：形式新颖，表现独特</li></ol><p>评分标准：创意30%、技术25%、内容25%、表现力20%</p>',
            images: []
          }
        }
      ],
      selectedPlans: []
    }
  },
  {
    id: 'template-7',
    name: '公益服务-垃圾分类宣传',
    description: '适用于思想品德和社会实践类公益活动，包含活动介绍、签到、环保知识学习、实践宣传和总结反思等环节',
    categories: ['MORAL_EDUCATION', 'SOCIAL_PRACTICE'],
    coverImage: '/images/activities/8.png',
    createdBy: 'system',
    createdAt: '2024-02-10',
    templateData: {
      title: '公益服务-垃圾分类宣传',
      description: '通过垃圾分类宣传公益活动，培养学生的环保意识、社会责任感和公益精神，提升思想品德和社会实践能力',
      organizer: '广州华颖外国语学校',
      grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'],
      classes: [],
      categories: ['MORAL_EDUCATION', 'SOCIAL_PRACTICE'],
      location: '社区、学校周边',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      maxParticipants: 300,
      responsibleTeacher: '',
      requireRegistration: true,
      observationPoints: ['3', '23'], // 公益活动、劳动实践
      processSteps: [
        {
          id: 'step1',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '垃圾分类宣传介绍',
          order: 0,
          data: {
            content: '<h3>公益服务-垃圾分类宣传活动介绍</h3><p>欢迎参加垃圾分类宣传公益活动！这是一项能够有效提升学生环保意识和社会责任感的活动。</p><p><strong>活动目标：</strong></p><ul><li>增强学生的环保意识和生态观念</li><li>培养学生的社会责任感和公益精神</li><li>提升学生的社会实践能力和沟通能力</li><li>促进社区环保意识的普及和提升</li></ul>',
            images: []
          }
        },
        {
          id: 'step2',
          type: 'checkin' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '垃圾分类宣传签到',
          order: 1,
          data: {
            description: '请各班级代表进行签到确认参与垃圾分类宣传公益活动'
          }
        },
        {
          id: 'step3',
          type: 'content' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '垃圾分类知识学习',
          order: 2,
          data: {
            content: '<h3>垃圾分类知识学习</h3><h4>一、垃圾分类的意义</h4><ul><li>保护环境，减少污染</li><li>节约资源，促进循环利用</li><li>改善生活质量，建设美丽家园</li><li>培养环保意识，形成良好习惯</li></ul><h4>二、垃圾分类标准</h4><ul><li>可回收物：纸张、塑料、金属、玻璃等</li><li>有害垃圾：电池、灯管、药品、油漆等</li><li>厨余垃圾：食物残渣、果皮、菜叶等</li><li>其他垃圾：除上述三类外的其他垃圾</li></ul>',
            images: []
          }
        },
        {
          id: 'step4',
          type: 'video' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '环保宣传视频',
          order: 3,
          data: {
            title: '环保宣传教育视频',
            description: '观看环保宣传教育视频，深入了解垃圾分类的重要性和方法'
          }
        },
        {
          id: 'step5',
          type: 'task' as 'content' | 'checkin' | 'video' | 'questionnaire' | 'task',
          title: '垃圾分类宣传实践',
          order: 4,
          data: {
            title: '垃圾分类宣传实践任务',
            type: 'text',
            requirements: '<h4>任务要求：</h4><p>请各班级进行垃圾分类宣传实践活动，要求：</p><ol><li>制作垃圾分类宣传材料（海报、传单等）</li><li>到社区、学校周边进行宣传</li><li>向居民讲解垃圾分类知识</li><li>协助居民进行垃圾分类实践</li><li>收集宣传效果和居民反馈</li></ol><p>活动要求：态度友好，讲解准确，效果明显，记录详细</p>',
            images: []
          }
        }
      ],
      selectedPlans: []
    }
  }
]

// 获取所有模板
export const getAllTemplates = () => {
  try {
    // 从 localStorage 获取用户创建的模板
    const userTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]')
    
    // 合并系统模板和用户模板
    const allTemplates = [...mockTemplates, ...userTemplates]
    
    // 按创建时间排序（最新的在前）
    return allTemplates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('获取用户模板失败:', error)
    return mockTemplates
  }
}

// 根据ID获取模板
export const getTemplateById = (templateId: string) => {
  // 先在系统模板中查找
  let template = mockTemplates.find(template => template.id === templateId)
  
  // 如果没找到，在用户模板中查找
  if (!template) {
    try {
      const userTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]')
      template = userTemplates.find((template: ActivityTemplate) => template.id === templateId)
    } catch (error) {
      console.error('获取用户模板失败:', error)
    }
  }
  
  return template
}

// 根据类别获取模板
export const getTemplatesByCategory = (category: string) => {
  const allTemplates = getAllTemplates()
  return allTemplates.filter(template => template.categories.includes(category))
}

// 创建新模板
export const addNewTemplate = (templateData: Omit<ActivityTemplate, 'id' | 'createdAt'>) => {
  const newTemplate: ActivityTemplate = {
    id: `template-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    ...templateData
  }
  
  // 添加到模板列表
  mockTemplates.push(newTemplate)
  
  // 保存到 localStorage
  try {
    const existingTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]')
    existingTemplates.push(newTemplate)
    localStorage.setItem('userTemplates', JSON.stringify(existingTemplates))
    console.log('模板已保存到本地存储')
  } catch (error) {
    console.error('保存模板到本地存储失败:', error)
  }
  
  console.log('新模板已创建:', newTemplate)
  return newTemplate
}
