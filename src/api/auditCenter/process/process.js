import request from '@/utils/request'

// 我发起的查询列表
export function getProcessList() {
  return request({
    url: `/pms/examine/queryActiveModel`,
    method: 'get',
  })
}

//详情
export function getDetailList(query){
  return request({
    url: `/pms/examine/queryActiveDetailById`,
    method: 'get',
    params: query
  })
}

//审核人员
export function getParentByIdList(query){
  return request({
    url: `/system/user/queryParentById`,
    method: 'get',
    params: query
  })
}

//保存
export function getEditActiveModelList(query){
  return request({
    url: `/pms/examine/editActiveModel`,
    method: 'post',
    data: query
  })
}

//部门搜索
export function getDeptList(){
  return request({
    url: `/system/dept_manage/treeselect`,
    method: 'get',
  })
}

export function getQueryUserInfoList(data){
  return request({
    url: `system/user/queryUserInfo`,
    method: 'get',
    params:data
  })
}
