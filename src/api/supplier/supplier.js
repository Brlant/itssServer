import request from '@/utils/request'

// 我的待办查询列表
export function getSupplierList(data) {
  return request({
    url: `/pms/supplier/queryOverview`,
    method: 'post',
    data:data,
  })
}
