import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function getTimeProcess(data) {
  return request({
    url: '/project/project/timeProcess',
    method: 'post',
    data: data
  })
}
// 字典查询 传入字典名称
export function queryDict(dictCode) {
  return request({
    url: '/system/dict/data/type/'+dictCode,
    method: 'get',
    // params: query
  })
}
// 新增项目列表
export function addProjectList(data){
  return request({
    url: '/project/project/addProject',
    method: 'post',
    data: data
  })
}
// 列表页面 项目管理查询接口
export function searchProjectList(data){  
  return request({
    url: '/project/project/list',
    method: 'post',
    data: data
  })
}
// 对于项目的开启和终止
export function updateProjectStatus(query) {
  return request({
    url: '/project/project/updateProjectStatus',
    method: 'get',
    params: query
  })
}
// 列表页面 实际完成工作修改
export function updateProjectById(data){  
  return request({
    url: '/project/project/updateProjectById',
    method: 'post',
    data: data
  })
}
// 项目管理的详情页
export function queryInfoById(data){  
  // console.log(data);
  return request({
    url: '/project/project/queryInfoById',
    method: 'post',
    data: data
  })
}
// 查询正在审核的 项目修改的日志记录
export function queryProjectAudit(data){  
  // console.log(data);
  return request({
    url: '/project/projectAudit/list',
    method: 'post',
    data: data
  })
}
// 对已经提交的修改 项目基本信息 进行审核

export function updateAuditProById(query) {
  return request({
    url: '/project/projectAudit/updateById',
    method: 'get',
    params: query
  })
}




//----------------demo------------------------------------
// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}
// 查询用户 下拉 不带分页
export function queryUserlist() {
  return request({
    url: '/system/user/queryUserlist',
    method: 'get',
    // params: query
  })
}
// 查询用户详细
export function getUser(userId) {
  return request({
    url: `/system/user/` + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}
 