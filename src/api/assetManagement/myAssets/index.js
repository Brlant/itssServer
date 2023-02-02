import request from '@/utils/request'

// 个人资产列表
export function personalAssetList(data, params) {
  return request({
    url: '/asset/assetPersonal/list',
    method: 'post',
    data,
    params
  })
}

// 我的申请
export function applyList(params) {
  return request({
    url: '/flowable/flowable/task/myProcess',
    method: 'get',
    params
  })
}

// 流程类型
export function cateList(params) {
  return request({
    url: '/flowable/bizFlowGroup/groupGetCategoryList',
    method: 'get',
    params
  })
}

// 流程查询所属资产信息
export function listAsset(flowId) {
  return request({
    url: '/asset/assetFlow/listAsset/' + flowId,
    method: 'get',
  })
}

// 进度
export function flowViewer(params) {
  return request({
    url: '/flowable/flowable/task/flowViewer',
    method: 'get',
    params
  })
}

// 取消
export function stopProcess(data) {
  return request({
    url: '/flowable/flowable/task/stopProcess',
    method: 'post',
    data
  })
}

// 获取数量
export function getFlowStatusSum(id) {
  return request({
    url: `/asset/assetFlow/getFlowStatusSum/${id}`,
    method: 'get'
  })
}
