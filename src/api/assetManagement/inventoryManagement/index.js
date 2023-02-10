import request from '@/utils/request'

// 盘点列表 - 分页
export function getAssetInventory(params) {
  return request({
    url: '/asset/assetInventory/list',
    method: 'get',
    params
  })
}

// 发起盘点
export function initiateInventory(data) {
  return request({
    url: '/asset/approvalProcess/initiateInventory',
    method: 'post',
    data: data
  })
}

// 发起报损
export function initiateFrmLoss(data) {
  return request({
    url: '/asset/approvalProcess/initiateFrmLoss',
    method: 'post',
    data: data
  })
}

// 上传文件
export function fileUpload(data) {
  return request({
    url: `/file/upload`,
    method: 'post',
    data
  })
}

// 查看流程
export function getInventoryFlow(params) {
  return request({
    url: '/flowable/bizFlowGroup/getInventoryFlow',
    method: 'get',
    params
  })
}

// 编辑盘点流程设置
export function updateInventory(data) {
  return request({
    url: '/flowable/bizFlowGroup/updateInventory',
    method: 'put',
    data: data
  })
}

// 盘点任务详情
export function getById(params) {
  return request({
    url: '/asset/assetInventory/getById',
    method: 'get',
    params
  })
}

// 资产盘点确认
export function assetConfirm(params) {
  return request({
    url: '/asset/assetInventoryInfo/assetConfirm',
    method: 'get',
    params
  })
}

