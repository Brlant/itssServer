import request from '@/utils/request'

// 我的待办查询列表
export function getDealtWithList(data) {
  return request({
    url: `/pms/examine/queryExamineOverview`,
    method: 'post',
    data:data,
  })
}
