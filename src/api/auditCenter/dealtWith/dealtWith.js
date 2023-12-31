import request from '@/utils/request'

// 我的待办查询列表
export function getDealtWithList(params) {
  return request({
    url: `/pms/examine/my-todo`,
    method: 'get',
    params:params,
  })
}
