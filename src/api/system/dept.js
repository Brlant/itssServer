import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}
// 查询部门下拉树结构
export function treeselect(query) {
  return request({
    url: '/system/dept_manage/treeselect',
    method: 'get',
    params: query
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}


// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}

// 根据部门编号获取所有子部门信息
export function queryChildDeptById(query) {
  return request({
    url: '/system/dept_manage/queryChildDeptById',
    method: 'get',
    params: query
  })
}

// 根据部门编号获取所有子部门信息 返回树形结构
export function queryChildDepts(query) {
  return request({
    url: '/system/dept_manage/queryChildDepts',
    method: 'get',
    params: query
  })
}

