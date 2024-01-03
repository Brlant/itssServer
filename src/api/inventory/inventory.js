import request, { download } from '@/utils/request'

const inventoryApi = {
//查询
  queryInventory(data) {
    return request({
      url: '/pms/order/queryStockOverview',
      method: 'get',
      params:data,
    })
  },
  //流水列表
  queryInventoryLog(params) {
    return request({
      url: `/pms/order/queryByStockId`,
      method: 'get',
      params:params,
    })
  },
  //导出
  exportInventoryLog(data) {
    return download(`/pms/order/exportPmsStock`,data,`库存管理_${new Date().getTime()}.xlsx`)
  },
}

export default inventoryApi;
