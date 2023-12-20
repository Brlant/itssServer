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


// 订单列表
function getOrderList(params) {
  return request.post(ORDER_LIST, params)
}

// 订单详情
function getOrderDetail(params) {
  return request.get(ORDER_DETAIL, {params})
}

// 新增订单数据
function addPmsOrder(data) {
  return request.post(ORDER_ADD, data)
}

// 订单编辑
function editOrderInfo(data) {
  return request.post(ORDER_EDIT, data)
}

// 订单审核
function examineOrderInfo(data) {
  return request.post(ORDER_AUDIT, data)
}

// 订单导入
function importInOrderInfo(data) {
  return request.post(ORDER_IMPORT, data)
}

// 订单导出
function exportOrder(data) {
  return download(ORDER_EXPORT,data,`入库单信息_${new Date().getTime()}.xlsx`)
}

// 订单库存查询
function queryStockOverview(params) {
  return request.get(ORDER_STOCK_OVERVIEW, {params})
}

// 导出库存
function exportPmsStock(params) {
  return request.get(ORDER_EXPORT_STOCK, {params})
}

// 订单确认收货
function confirmReceipt(data) {
  return request.post(ORDER_CONFIRM_RECEIPT, data)
}

// 输出订单相关的接口
export const orderApi = {
  getOrderList,
  getOrderDetail,
  addPmsOrder,
  editOrderInfo,
  examineOrderInfo,
  importInOrderInfo,
  exportOrder,
  queryStockOverview,
  exportPmsStock,
  confirmReceipt
}

// 默认输出全部接口
export default orderApi
