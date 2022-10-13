import request from '@/utils/request'
//部门查询
export function departmentQuery(query) {
    return request({
      url: '/efficiencyManage/efficiencyManage/listOfficeEfficiency',
      method: 'get',
      params: query
    })
  }
//个人效率查询
export function userQuery(query) {
  return request({
    url: '/efficiencyManage/efficiencyManage/listUserEfficiency',
    method: 'get',
    params: query
  })
}
//查询用户列表
  export function queryUserlist(data) {
    return request({
      url: '/system/user/queryUserlist',
      method: 'post',
      data
    })
  }