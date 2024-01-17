// 定义订单相关的接口
import request, {download} from '@/utils/request'


// 接口前缀
const PREFIX = '/pms/order'

// 订单列表
const ORDER_LIST = PREFIX + '/queryOverview'
// 根据id查询详情
const ORDER_DETAIL = PREFIX + '/queryByOrderId'
// 新增订单数据
const ORDER_ADD = PREFIX + '/addPmsOrder'
// 订单编辑
const ORDER_EDIT = PREFIX + '/editOrderInfo'
// 订单审核
const ORDER_AUDIT = PREFIX + '/examineOrderInfo'
// 订单导入
const ORDER_IMPORT = PREFIX + '/importInOrderInfo'
// 订单导出
const ORDER_EXPORT = PREFIX + '/exportPmsOrder'
// 订单库存
const ORDER_STOCK_OVERVIEW = PREFIX + '/queryStockOverview'
// 导出库存
const ORDER_EXPORT_STOCK = PREFIX + '/exportPmsStock'
// 订单收货
const ORDER_CONFIRM_RECEIPT = PREFIX + '/confirmReceipt'
// 查询订单的审核信息
const ORDER_AUDIT_RECORDS = PREFIX + '/queryExamineById'
// 查询订单的操作日志
const ORDER_LOG_DETAILS = PREFIX + '/queryOperatorById'
// 取消订单
const ORDER_CANCEL = PREFIX + '/cancelOrderInfo'


/**
 * 订单列表
 * @param {{rangeDate: [], orderType: string, orderBizType: string, endDate: string, applyDepart: string, pmsOrderNo: string, pageSize: number, pmsOrderStatus: string, pageNum: number, startDate: string, applyUserId: string}|D} params
 */
export function getOrderList(params) {
  return request.post(ORDER_LIST, params)
}

// 订单详情
export function getOrderDetail(id) {
  return request.get(ORDER_DETAIL, {
    params: {
      id
    }
  })
}

// 新增订单数据
export function addPmsOrder(data) {
  return request.post(ORDER_ADD, data)
}

// 订单编辑
export function editOrderInfo(data) {
  return request.post(ORDER_EDIT, data)
}

// 订单审核
export function examineOrderInfo(data) {
  return request.post(ORDER_AUDIT, data)
}

// 订单导入
export function importInOrderInfo(data) {
  return request.post(ORDER_IMPORT, data)
}

// 上传签收单
export function uploadReceipt(data) {
  return request.post(ORDER_IMPORT, data)
}
// 下载订单导入模板
export function downloadOrderTemplate() {
  return download(`/pms/examine/downloadTemplate?type=2`, {}, `订单导入模板_${new Date().getTime()}.xlsx`)
}
// 下载签收单模板
export function downloadReceiptTemplate() {
  return download(`/pms/examine/downloadTemplate?type=3`, {}, `签收单模板_${new Date().getTime()}.xlsx`)
}
// 订单导出（入库单）
export function exportInOrder(data) {
  return download(ORDER_EXPORT, data, `入库单信息_${new Date().getTime()}.xlsx`)
}

// 订单导出（出库单）
export function exportOutOrder(data) {
  return download(ORDER_EXPORT, data, `出库单信息_${new Date().getTime()}.xlsx`)
}

// 订单库存查询
export function queryStockOverview(params) {
  return request.get(ORDER_STOCK_OVERVIEW, {params})
}

// 导出库存
export function exportPmsStock(params) {
  return request.get(ORDER_EXPORT_STOCK, {params})
}

// 订单确认收货
export function confirmReceipt(data) {
  return request.post(ORDER_CONFIRM_RECEIPT, data)
}

// 查询订单详情的审核信息
export function queryOrderAuditLog(orderId, orderType) {
  return request.get(ORDER_AUDIT_RECORDS, {
    params: {
      orderId, orderType
    }
  })
}

// 查询订单日志
export function queryOrderLog(orderId) {
  return request.get(ORDER_LOG_DETAILS, {
    params: {
      orderId
    }
  })
}

/**
 * 取消订单
 * @param {string} pmsOrderId 订单id
 * @param {string} orderType 订单类型
 */
export function cancelOrderInfo(pmsOrderId,orderType) {
  return request.post(ORDER_CANCEL,{pmsOrderId,orderType})
}
