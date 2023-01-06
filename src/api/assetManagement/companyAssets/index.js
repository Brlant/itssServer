import request from '@/utils/request'

// 公司资产列表
export function queryAssetList(data) {
  return request({
    url: '/asset/asset/list',
    method: 'post',
    data
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
