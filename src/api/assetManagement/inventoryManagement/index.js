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
    url: 'asset/approvalProcess/initiateInventory',
    method: 'post',
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

