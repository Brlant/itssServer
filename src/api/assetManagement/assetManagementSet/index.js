import request from '@/utils/request'

export function getTypeData() {
    return request({
      url: '/asset/assetType/listTwoClass',
      method: 'get',
    })
  }
  //查询子分类
  export function querySubcategory(query) {
    return request({
      url: '/asset/assetType/listByParentId/'+query.id,
      method: 'get',
      params:query
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
  //禁用启用
  export function disableEnable(data) {
    return request({
      url: '/asset/assetType/enable',
      method: 'post',
      data
    })
  }
  //删除
  export function deleteAsset(id) {
    return request({
      url: '/asset/assetType/'+id,
      method: 'delete'
    })
  }
  //详情模板
  export function getAssetTemplate(query) {
    return request({
      url: '/asset/assetTemplate/list',
      method: 'get',
      params:query
    })
  }
  //流程组分页查询
  export function getapprovalProcess(query) {
    return request({
      url: '/flowable/bizFlowGroup/page',
      method: 'get',
      params:query
    })
  }