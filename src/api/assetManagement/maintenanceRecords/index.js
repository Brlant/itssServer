import request from '@/utils/request'
//维修记录
export function maintenanceRecord(query) {
    return request({
      url: '/asset/assetMaintenanceRecord/page',
      method: 'get',
      params:query
    })
  }
  //报废和盘亏
  export function maintenanceScrapRecord(query) {
    return request({
      url: '/asset/assetUseRecord/page',
      method: 'get',
      params:query
    })
  }