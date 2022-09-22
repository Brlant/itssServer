import request from '@/utils/request'
import { param } from '../../utils'
/** 模板导出导入 **/
export class baseUploadImport {
  downloadExcel() {
    return request({
      url: '/business/order/export-order-template',
      method: 'get',
      responseType: 'blob'
    })
  }
  importExcel(file) {
    return request({
      url: '/business/order/import-order',
      method: 'post',
      data: file
    })
  }
}

//新增订单
export class orderList {
  addOrderForm(data) {
    return request({
      url: '/business/order',
      method: 'post',
      data: data
    })
  }
  queryOrderList(query) {
    return request({
      url: '/business/order/list',
      method: 'GET',
      params: query
    })
  }
  detailOrder(orderId){
    return request({
      url: `/business/order/${orderId}`,
      method: 'GET',
    })
  }
  //操作日志
  detailOrderLog(query){
    return request({
      url: '/business/log/list',
      method: 'GET',
      params: query
    })
  }
  //推送日志
  pushOrderLog(query){
    return request({
      url: '/business/order-push-log',
      method: 'GET',
      params: query
    })
  }
  //确认分配
  order(query){
    return request({
      url: '/business/order',
      method: 'PUT',
      data: query
    })
  }
  //重新分配
  resetOrder(query){
    return request({
      url: '/business/order',
      method: 'PUT',
      data: query
    })
  }
  //取消
  quXiaoOrder(id){
    return request({
      url: `/business/order/${id}`,
      method: 'PUT',
    })
  }
}

export class unitOrderList{
  //单位列表
  unitList(query){
    return request({
      url: '/system/unit/list',
      method: 'GET',
      params: query
    })
  }
  //承运商
  carrierList(params){
    return request({
      url: '/system/carrier/list',
      method: 'GET',
      params: params
    })
  }
}
 // 收货单位下拉列表（白名单）
 export function receiverList(data) {
  return request({
    url: `/business/receiver/list?receiverName=${data.receiverName}&pageNo=${data.pageNo}&pageSize=${data.pageSize}&senderId=${data.senderId}`,
    method: 'get'
  })
}
