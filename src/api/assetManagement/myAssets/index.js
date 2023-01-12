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
