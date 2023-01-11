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
// 上传文件
export function addCertificate(data) {
  return request({
    url: `/asset/assetCertificate/add`,
    method: 'post',
    data
  })
}
