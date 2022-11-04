import request from '@/utils/request'

// 以下为字典组接口
// 字典组列表
export function dictList(params) {
  return request({
    url: `/system/dict/type/getDictList`,
    method: 'get',
    params
  })
}

// 字典数据
export function dictData(params) {
  return request({
    url: `/system/dict/data/list`,
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