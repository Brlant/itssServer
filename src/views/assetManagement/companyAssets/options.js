export const tabOptions = [
  {
    label: '全部资产',
    name: 0,
    value: null,
    type: null
  },
  {
    // label: '在库(固定资产)',
    label: '已入库(固定资产)',
    name: 1,
    value: 1,
    type: 'specialStatus'
  },
  {
    // label: '闲置中',
    // 2023/06/30 v1.1版本
    label: '在库',
    name: 2,
    value: 1,
    type: 'status'
  },
  {
    label: '使用中',
    name: 3,
    value: 2,
    type: 'status'
  },
  {
    label: '借用中',
    name: 4,
    value: 3,
    type: 'status'
  },
  {
    // label: '在库(耗材)',
    label: '已入库(耗材)',
    name: 5,
    value: 2,
    type: 'specialStatus'
  },
  {
    label: '已耗尽',
    name: 6,
    value: 3,
    type: 'specialStatus'
  },
  {
    label: '维修中',
    name: 7,
    value: 4,
    type: 'status'
  },
  {
    label: '已报废',
    name: 8,
    value: 5,
    type: 'status'
  },
  {
    label: '盘亏',
    name: 9,
    value: 6,
    type: 'status'
  },
  {
    label: '待审批入库',
    name: 10,
    value: 7,
    type: 'status'
  }
]

export const detailInformation = [
  {
    // label: "税前价格",
    // 2023/06/30 v1.1版本
    label: "购入价格(含税)",
    name: "preTaxPrice",
    value: "",
    status: "preTaxPriceFlag",
  },
  {
    label: "CPU",
    name: "cpu",
    value: "",
    status: "cpuFlag",
  },
  {
    label: "CPU主频",
    name: "cpuHertz",
    value: "",
    status: "cpuHertzFlag",
  },
  {
    label: "内存型号",
    name: "memory",
    value: "",
    status: "memoryFlag",
  },
  {
    label: "内存容量",
    name: "memorySize",
    value: "",
    status: "memorySizeFlag",
  },
  {
    label: "显卡型号",
    name: "graphicsCard",
    value: "",
    status: "graphicsCardFlag",
  },
  {
    label: "显卡容量",
    name: "graphicsMemorySize",
    value: "",
    status: "graphicsMemorySizeFlag",
  },
  {
    label: "硬盘型号",
    name: "hardDisk",
    value: "",
    status: "hardDiskFlag",
  },
  {
    label: "硬盘容量",
    name: "hardDiskSize",
    value: "",
    status: "hardDiskSizeFlag",
  },
  {
    label: "显示器分辨率",
    name: "resolutionRadio",
    value: "",
    status: "resolutionRadioFlag",
  },
  {
    label: "操作系统",
    name: "os",
    value: "",
    status: "osFlag",
  },
  {
    label: "杀毒软件",
    name: "antivirus",
    value: "",
    status: "antivirusFlag",
  },
  {
    label: "办公软件",
    name: "office",
    value: "",
    status: "officeFlag",
  },
  {
    label: "MAC地址",
    name: "macAddress",
    value: "",
    status: "macAddressFlag",
  },
  {
    label: "IP地址",
    name: "ipAddress",
    value: "",
    status: "ipAddressFlag",
  },
  {
    label: "序列号",
    name: "serialNumber",
    value: "",
    status: "serialNumberFlag",
  },
  {
    label: "测量范围",
    name: "measuringRange",
    value: "",
    status: "measuringRangeFlag",
  },
  {
    label: "使用范围",
    name: "usableRange",
    value: "",
    status: "usableRangeFlag",
  },
  {
    label: "采样频率",
    name: "sampleFrequency",
    value: "",
    status: "sampleFrequencyFlag",
  },
  {
    label: "相变材料",
    name: "phaseChangeMaterial",
    value: "",
    status: "phaseChangeMaterialFlag",
  },
  {
    label: "其他信息",
    name: "additionalInfo",
    value: "",
    status: "additionalInfoFlag",
  }
]

export const information = [
  {
    label: "资产类型",
    name: "assetTypeId"
  },
  {
    label: "填充模板",
    name: "templateId"
  },
  {
    label: "资产编号",
    name: "assetId"
  },
  {
    label: "财务编号",
    name: "financialNo"
  },
  {
    label: "资产名称",
    name: "assetName"
  },
  {
    label: "品牌",
    name: "brand"
  },
  {
    label: "型号",
    name: "model"
  },
  {
    label: '保修期',
    name: 'maintenanceTime'
  },
  {
    label: '购入时间',
    name: 'purchasingDate'
  },
  {
    label: '税后价格',
    name: 'afterTaxPrice'
  },
  {
    label: '数量',
    name: 'amount'
  },
  {
    label: '存放点',
    name: 'storageAddress'
  },
  {
    label: '归属部门',
    name: 'departmentId'
  },
  {
    label: '保管员',
    name: 'keeper'
  },
  {
    label: '备注',
    name: 'remark'
  },
  {
    label: '折旧年限',
    name: 'depreciableLife'
  }
]
