import request from '@/utils/request'
//项目组查询
export function teamQuery(query) {
    return request({
      url: '/projectManage/projectGroup/list',
      method: 'get',
      params: query
    })
  }
//新增项目组
export function teamAdd(data) {
  return request({
    url: '/projectManage/projectGroup',
    method: 'post',
    data
  })
}
export function teamedit(data) {
    return request({
      url: '/projectManage/projectGroup',
      method: 'PUT',
      data
    })
  }
  //删除项目组
  export function deleteTeam(groupId) {
    return request({
      url: '/projectManage/projectGroup/'+groupId,
      method: 'delete',
     
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