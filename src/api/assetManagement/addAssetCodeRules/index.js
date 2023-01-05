import request from '@/utils/request'
//分页查询
export function queryAssetCodeRule(query) {
    return request({
      url: '/asset/assetNoRule/page',
      method: 'get',
      params:query
    })
  }
  //删除编号规则
  export function deleteAssetRule(id) {
    return request({
      url: '/asset/assetNoRule/'+id,
      method: 'delete'
    })
  }
  //禁用启用编号规则
  export function disableEnable(data) {
    return request({
      url: '/asset/assetNoRule/enable',
      method: 'post',
      data
    })
  }
  //禁用启用编号规则
  export function queryType() {
    return request({
      url: '/asset/assetType/listAllType',
      method: 'get',
    })
  }
  //新增规则
  export function newAddRule(data) {
    return request({
      url: '/asset/assetNoRule',
      method: 'post',
      data
    })
  }
   //编辑规则
   export function editRule(data) {
    return request({
      url: '/asset/assetNoRule',
      method: 'put',
      data
    })
  }