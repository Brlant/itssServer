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
export function queryUserlist() {
  return request({
    url: '/system/user/efficiency/userListByPermission',
    method: 'get',
  })
}

// 实时统计
export function statJob(query) {
  return request({
    url: '/threeInterface/statJob/gitlabAndTb',
    method: 'get',
    params: query
  })
}

// 查询配置
export function getTbConf() {
  return request({
    url: '/threeInterface/gitlabStat/getTbConf',
    method: 'get'
  })
}

// 修改配置
export function updateTbConf(query) {
  return request({
    url: '/threeInterface/gitlabStat/updateTbCookie',
    method: 'post',
    data: query
  })
}

// 导出excel
export function exportExcel(query) {
  return request({
    url: '/efficiencyManage/efficiencyManage/exportOfficeEfficiency',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 导出excel (个人)
export function exportUserExcel(query) {
  return request({
    url: '/efficiencyManage/efficiencyManage/exportUserEfficiency',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
