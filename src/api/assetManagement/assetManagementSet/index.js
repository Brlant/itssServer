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
    //流程组详情
  export function getDetailProcess(id) {
    return request({
      url: '/flowable/bizFlowGroup/getInfoForm/'+id,
      method: 'get'
    })
  }
  //查询流程组管理的流程模型类型列表
  export function getProcessType(id) {
    return request({
      url: '/flowable/bizFlowGroup/groupGetCategoryList',
      method: 'get'
    })
  }
  //新建流程组
  export function newGroup(data) {
    return request({
      url: '/flowable/bizFlowGroup/',
      method: 'post',
      data
    })
  }
  //编辑流程组
  export function editGroup(data) {
    return request({
      url: '/flowable/bizFlowGroup/',
      method: 'put',
      data
    })
  }
  //删除流程组
  export function deleteGroup(id) {
    return request({
      url: '/flowable/bizFlowGroup/'+id,
      method: 'delete'
    })
  }
  //启用禁用流程组
  export function isUserGroup(data) {
    return request({
      url: '/flowable/bizFlowGroup/enable',
      method: 'put',
      data
    })
  }
  export function getUserListByType(type) {
    return request({
      url: 'flowable/flowable/definition/infoList?type='+type,
      method: 'get'
    })
  }
  export function getdictListByType() {
    return request({
      url: 'flowable/flowable/task/findBizDict',
      method: 'get'
    })
  }
  //发布模型
  export function deployModel(data) {
    return request({
      url: 'flowable/flowable/definition/deploy',
      method: 'post',
      data
    })
  }
// 审批流程组
export function flowGroup(query) {
  return request({
    url: '/flowable/bizFlowGroup/listFlowGroup',
    method: 'get',
    params: query
  })
}
