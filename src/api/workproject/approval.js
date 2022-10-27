import request from '@/utils/request'
//精简模式
export function approvalItems(query) {
    return request({
      url: '/timetrack/time-track/listProjectTimeTrackByWeek',
      method: 'get',
      params: query
    })
}
// 权限
export function listByUserId(query) {
  return request({
    url: '/projectManage/project/listByUserId',
    method: 'get',
    params: query
  })
}
//精简模式审批
export function approval(data) {
    return request({
      url: '/timetrack/time-track/approval',
      method: 'post',
      data: data
    })
  }
  //详情模式
  export function approvalMonth(query) {
    return request({
      url: '/timetrack/time-track/listTimeTrack',
      method: 'get',
      params: query
    })
} 
//详情模式审批
export function datailApproval(data) {
  return request({
    url: '/timetrack/time-track/approvalById',
    method: 'post',
    data: data
  })
}