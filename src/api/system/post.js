import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/system/post_manage/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/system/post_manage/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/system/post_manage',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/system/post_manage',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/system/post_manage/' + postId,
    method: 'delete'
  })
}

//查找区域，职位类型
export function areatypePost(query) {
  return request({
    url: '/system/dict/data/type/'+query,
    method: 'get',
    // params: query
  })
}
//下拉菜单的职位遍历
export function optionSelect() {
  return request({
    url: '/system/post_manage/optionselect',
    method: 'get',
    // params: query
  })
}
