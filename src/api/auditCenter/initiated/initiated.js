import request from '@/utils/request'

// 我发起的查询列表
export function getInitiatedList(params) {
  return request({
    url: `/pms/examine/my-todo`,
    method: 'get',
    params:params,
  })
}

//详情
export function getQueryDetail(data) {
  return request({
    url: `/pms/examine/queryDetailById`,
    method: 'get',
    params:data,
  })
}

//审核信息
export function getExamineInfo(data) {
  return request({
    url: `/pms/examine/queryExamineByIdAndType`,
    method: 'get',
    params:data,
  })
}

//审核日志
export function getExamineLog(data) {
  return request({
    url: `/pms/examine/queryLogByIdAndType`,
    method: 'get',
    params:data,
  })
}
