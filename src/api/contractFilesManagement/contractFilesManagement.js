import request from '@/utils/request'


//合同档案管理-合同档案列表
export function getContractFileList(data) {
  return request({
    url: `/pms/contract/queryList`,
    method: 'get',
    params:data,
  })
}

//合同档案管理-合同档案到期列表
export function queryExpireList(data) {
  return request({
    url: `/pms/contract/queryExpireList`,
    method: 'get',
    params:data,
  })
}

//合同档案管理-合同档案详情
export function queryByContractId(data) {
  return request({
    url: `/pms/contract/queryByContractId`,
    method: 'get',
    params:data,
  })
}

//合同档案管理-合同档案续签
export function renewal(data) {
  return request({
    url: `/pms/contract/renewal`,
    method: 'post',
    data,
  })
}

//合同档案管理-合同档案新增
export function addContractFile(data) {
  return request({
    url: `/pms/contract/add`,
    method: 'post',
    data,
  })
}

//合同档案管理-查询合同审核详情
export function queryExamineById(data) {
  return request({
    url: `/pms/contract/queryExamineById`,
    method: 'get',
    params:data,
  })
}

//合同档案管理-查询合同操作日志信息
export function queryOperatorById(data) {
  return request({
    url: `/pms/contract/queryOperatorById`,
    method: 'get',
    params:data,
  })
}

//合同档案管理-合同流程的审核
export function examineContractInfo(data) {
  return request({
    url: `/pms/contract/examineContractInfo`,
    method: 'post',
    data
  })
}

//合同档案管理-合同的启用/停用
export function editStatus(data) {
  return request({
    url: `/pms/contract/editStatus`,
    method: 'post',
    data
  })
}

//创建人
export function getUserList(data) {
  return request({
    url: `/system/user/list`,
    method: 'get',
    params:data,
  })
}
