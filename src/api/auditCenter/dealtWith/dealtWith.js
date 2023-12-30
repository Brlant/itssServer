import request from '@/utils/request'

// 我的待办查询列表
export function getDealtWithList(data) {
  return request({
    url: `/pms/examine/my-todo`,
    method: 'get',
    data:data,
  })
}
