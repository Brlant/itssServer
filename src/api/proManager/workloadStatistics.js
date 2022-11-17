import request from '@/utils/request'
//部门查询
export function departmentQuery(data) {
    return request({
      url: '/workloadCensus/workload/list',
      method: 'post',
      data
    })
  }
//个人效率查询
export function userQuery(data) {
  return request({
    url: '/workloadCensus/workload/queryUserWork',
    method: 'post',
    data
  })
}
//查询用户列表
export function queryUserlist() {
  return request({
    url: '/system/user/workload/userListByPermission',
    method: 'get',
    
  })
}