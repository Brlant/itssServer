import request from '@/utils/request'
export function getTypeData() {
    return request({
      url: '/asset/assetType/listTwoClass',
      method: 'get',
    })
  }
  //新增资产
  export function newAddAsset(data) {
    return request({
      url: '/asset/assetType',
      method: 'post',
      data
    })
  }
  //编辑资产
  export function editAsset(data) {
    return request({
      url: '/asset/assetType',
      method: 'put',
      data
    })
  }