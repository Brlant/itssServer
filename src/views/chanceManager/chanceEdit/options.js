export const formData = {
  chanceName: "", //          机会名称
  chanceStatus: "", //          机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
  priority: 3, //          优先级（1.最高;2.高，3.普通，4.较低）
  projectId: null, //      已转项目
  projectName: null, //      已转项目
  chanceUserId: "",//       机会负责人id
  chanceUserName:"", //          机会负责人
  customer: "", //          客户
  customerLink: "", //          客户联系人
  tel: "", //          联系方式
  budget: undefined, //          客户预算
  successRate: undefined, //          成功率
  expectStartTime: "", //          预计开始时间
  expectEndTime: "", //          预计结束时间
  expectWork: undefined, //          预计工时（人日）
  expectOffer: undefined, //          预计报价
  chanceService: "", //          服务对象(1.对内;2.对外)
  remark: "", //          备注
}

export const rules = {
  chanceName: [{
    required: true,
    message: '请输入机会名称',
    trigger: 'blur'
  }],
  chanceStatus: [{
    required: true,
    message: '请选择机会状态',
    trigger: 'change'
  }],
  chanceUserId: [{
    required: true,
    message: '请输入负责人',
    trigger: 'change'
  }],
  priority: [{
    required: true,
    message: '请选择优先级',
    trigger: 'change'
  }],
  customer: [],
  customerLink: [],
  tel: [{
    pattern: /^1(3|4|5|7|8|9)\d{9}$/,
    message: '请输入正确的手机号！',
    trigger: 'blur'
  }],
  budget: [],
  successRate: [],
  expectStartTime: [],
  expectEndTime: [],
  expectOffer: [],
  expectOffer: [],
  chanceService: [{
    required: true,
    message: '请选择对内/对外',
    trigger: 'change'
  }],
  remark: [],
  // 配置信息的
  chanceConfigItemAreaId:[{
    required: true,
    message: '请选择区域!',
    trigger: 'change'
  }],
  chanceConfigItemPostId:[{
    required: true,
    message: '请选择职位!',
    trigger: 'change'
  }],
  chanceConfigItemGradeId:[{
    required: true,
    message: '请选择等级!',
    trigger: 'change'
  }],
  chanceConfigItemSkillIdList:[{
    required: true,
    message: '请选择技能需求!',
    trigger: 'change'
  }],
  chanceConfigItemStartEndTime:[{
    required: true,
    message: '请选择配置时间安排!',
    trigger: 'change'
  }]
}

export const chanceStatusOptions = [{
  "label": "新建",
  "value": 1
}, {
  "label": "跟进中",
  "value": 2
}, {
  "label": "已结束",
  "value": 3
}, {
  "label": "已转项目",
  "value": 4
}]

export const chanceUserIdOptions = [{
  "label": "周佩煌",
  "value": 1
}, {
  "label": "张帆",
  "value": 2
}]

export const priorityOptions = [{
  "label": "最高",
  "value": 1
}, {
  "label": "高",
  "value": 2
}, {
  "label": "普通",
  "value": 3
}, {
  "label": "较低",
  "value": 4
}]
