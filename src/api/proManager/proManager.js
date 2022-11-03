import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询时间区间内的 工时具体
export function getTimeProcess(data) {
  return request({
    url: '/projectManage/project/timeProcess',
    method: 'post',
    data: data
  })
}
// 详情页面，点击编辑进入编辑页面
export function proDetailBFEdit(projectId) {
  return request({
    url: `/projectManage/project/getById/${projectId}`,
    method: 'get',
    // params: query
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
    url: '/projectCreate/project-create/addProject',
    method: 'post',
    data: data
  })
}
// 列表页面 项目管理查询接口
export function searchProjectList(data){  
  return request({
    url: '/projectManage/project/list',
    method: 'post',
    data: data
  })
}
// 对于项目的开启和终止
export function updateProjectStatus(query) {
  return request({
    url: '/projectManage/project/updateProjectStatus',
    method: 'get',
    params: query
  })
}
// 列表页面 实际完成工作修改
export function updateProjectById(data){  
  return request({
    url: '/projectManage/project/updateProjectById',
    method: 'post',
    data: data
  })
}
// 详情页面的  新增 和修改 项目成员
export function updateProjectUserAddEdit(data){  
  return request({
    url: '/projectManage/project/updateProject',
    method: 'post',
    data: data
  })
}
// 详情页 点击成员 去查询具体的list 
export function updateQueryUserById(data){  
  return request({
    url: '/projectManage/project-user/queryUserById',
    method: 'post',
    data: data
  })
}

// 项目管理的详情页
export function queryInfoById(data){  
  // console.log(data);
  return request({
    url: '/projectManage/project/queryInfoById',
    method: 'post',
    data: data
  })
}
// 查询正在审核的 项目修改的日志记录
export function queryProjectAudit(data){  
  // console.log(data);
  return request({
    url: '/projectManage/projectAudit/list',
    method: 'post',
    data: data
  })
}
// 对已经提交的修改 项目基本信息 进行审核
export function updateAuditProById(query) {
  return request({
    url: '/projectManage/projectAudit/updateById',
    method: 'get',
    params: query
  })
}
// 查询用户 下拉 不带分页
export function queryUserlist(data) {
  // 此处的查询 额外的增加一个 状态 就是 在岗 未离职
  // status 1 离职
  // status 0 在职
  let dataTemp = {...data,status:0}
  return request({
    url: '/system/user/queryUserlist',
    method: 'post',
    data: dataTemp
  })
}
// 查询拥有项目主管权限的用户
export function queryUserlistByRole(data) {
  return request({
    url: '/system/user/queryUserlistByRole',
    method: 'post',
    data: data
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
// 项目组查询
export function teamQuery() {
  return request({
    url: '/projectManage/projectGroup/listAll',
    method: 'get',
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
 