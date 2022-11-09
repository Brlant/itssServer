import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}
export function queryUserlist(data) {
  return request({
    url: '/system/user/queryUserlist',
    method: 'post',
    data: data
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

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(data) {
  return request({
    url: `/system/user/batchUpdateStatus?userIds=${data.userIds}&userStatus=${data.userStatus}`,
    method: 'put'
  })
}
// 用户状态修改
export function changeStatus(data) {
  return request({
    url: `/system/user/changeStatus`,
    method: 'put',
    data:data
  })
}
// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}
export function queryUserList(query){
  return request({
    url: '/system/user/listByDeptId',
    method: 'get',
    params: query
  })
}
//人员详情
export function userDetail(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'get'
  })
}
//停用启用
export function stopUse(data) {
  return request({
    url: '/system/user/enableUserStatus',
    method: 'put',
    data: data
  })
}
//技能锁定
export function skillLocking(data) {
  return request({
    url: '/system/user/userSkillLock',
    method: 'put',
    data: data
  })
}
//职位名称
export function positionName(data) {
  return request({
    url: '/system/post_dict/list',
    method: 'post',
    data: data
  })
}
//查询用户条件
export function queryList() {
  return request({
    url: '/system/user/queryStr',
    method: 'get'
  })
}
//模糊查询用户
export function fuzzyQuery(query) {
  return request({
    url: '/system/user/query',
    method: 'get',
    params: query
  })
}
//设置负责人
export function setuser(data) {
  return request({
    url: '/system/dept_manage/setLeader',
    method: 'put',
    data: data
  })
}