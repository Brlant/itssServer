import request from '@/utils/request'


//合同档案管理-合同档案列表
export function getContractFileList(data) {
  return request({
    url: `/pms/contract/queryList`,
    method: 'get',
    params:data,
  })
}

//创建人
export function getUserList(data) {
  return request({
    url: `/system/user/list`,
    method: 'get',
    params:data,
  })
}
