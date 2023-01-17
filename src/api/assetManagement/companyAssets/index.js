import request from '@/utils/request'

// 公司资产列表
export function queryAssetList(data, params) {
  return request({
    url: '/asset/asset/list',
    method: 'post',
    data,
    params
  })
}

// 计算
export function getTotal(data) {
  return request({
    url: '/asset/asset/getTotal',
    method: 'post',
    data
  })
}

// 资产录入
export function addAssets(data) {
  return request({
    url: '/asset/asset/add',
    method: 'post',
    data
  })
}

// 资产详情
export function assetDetail(id) {
  return request({
    url: `/asset/asset/${id}`,
    method: 'get',
  })
}

// 资产编号
export function queryAssetId(assetTypeId) {
  return request({
    url: `/asset/assetNoRule/getCurrentAssetNo/${assetTypeId}`,
    method: 'post',
  })
}

// 资产修改
export function updateAssets(data) {
  return request({
    url: '/asset/asset/update',
    method: 'put',
    data
  })
}

// 证书列表
export function certificateList(data) {
  return request({
    url: `/asset/assetCertificate/list`,
    method: 'post',
    data
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

// 提交证书
export function addCertificate(data) {
  return request({
    url: `/asset/assetCertificate/add`,
    method: 'post',
    data
  })
}

// 保养列表
export function maintainList(data) {
  return request({
    url: `/asset/assetMaintain/list`,
    method: 'post',
    data
  })
}

// 提交保养
export function addMaintain(data) {
  return request({
    url: `/asset/assetMaintain/add`,
    method: 'post',
    data
  })
}

// 使用记录
export function useRecord(data) {
  return request({
    url: `/asset/assetUseRecord/list`,
    method: 'post',
    data
  })
}

// 维修记录
export function maintainRecord(data) {
  return request({
    url: `/asset/assetMaintenanceRecord/list`,
    method: 'post',
    data
  })
}
//发起入库
export function setWarehousing(data) {
  return request({
    url: `/asset/approvalProcess/assetInStorageInitiate`,
    method: 'post',
    data
  })
}
//查看审批流程
export function seeAssetProcess(query) {
  return request({
    url: '/asset/assetFlow/getFlowDefinitionDetail',
    method: 'get',
    params:query
  })
}