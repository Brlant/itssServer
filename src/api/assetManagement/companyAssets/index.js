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

// 资产修改
export function updateAssets(data) {
  return request({
    url: '/asset/asset/update',
    method: 'put',
    data
  })
}
