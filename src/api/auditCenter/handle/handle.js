import request from '@/utils/request'

// 我查询列表
export function getHandleList(data) {
  return request({
    url: `/pms/examine/my-todo`,
    method: 'get',
    data:data,
  })
}
