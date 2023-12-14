import request from '@/utils/request'

// 我查询列表
export function getHandleList(data) {
  return request({
    url: `/pms/examine/queryExamineOverview`,
    method: 'post',
    data:data,
  })
}
