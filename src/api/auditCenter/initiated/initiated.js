import request from '@/utils/request'

// 我发起的查询列表
export function getInitiatedList(data) {
  return request({
    url: `/pms/examine/queryExamineOverview`,
    method: 'post',
    data:data,
  })
}
