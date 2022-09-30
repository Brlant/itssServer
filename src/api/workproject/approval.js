import request from '@/utils/request'
export function approvalItems(query) {
    return request({
      url: '/timetrack/time-track/listProjectTimeTrackByWeek',
      method: 'get',
      params: query
    })
}
//审批
export function approval(data) {
    return request({
      url: '/timetrack/time-track/approval',
      method: 'post',
      data: data
    })
  }