import request from '@/utils/request'

// 以下为字典组接口
// 字典组列表
export function dictList(params) {
  return request({
    url: `/system/post_dict/getDictList`,
    method: 'get',
    params
  })
}

// 字典数据
export function dictData(params) {
  return request({
    url: `/system/post_dict/list`,
    method: 'get',
    params
  })
}

// 添加与编辑
export function addAndEdit(data, method = 'put') {
  return request({
      url: '/system/dict/data',
      method,
      data
  })
}

// 以下为职位管理字典接口
// 查询
export function queryPost(data) {
  return request({
    url: `/system/post_dict/postDictList`,
    method: 'post',
    data
  })
}

// 添加与编辑
export function updatePost(data, method = 'put') {
  return request({
      url: method === 'put' ? '/system/post_dict/editPostDict' : '/system/post_dict/addPostDict',
      method,
      data
  })
}
