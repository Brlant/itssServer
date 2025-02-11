import request,{download,uploadUrl} from '@/utils/request'

// 供应商接口
const supplierApi = {
  uploadUrl,
  // 列表查询
  getSupplierList(data) {
    return request({
      url: `/pms/supplier/queryOverview`,
      method: 'post',
      data: data,
    })
  },
  // 详情
  getSupplierDetails(id) {
    return request({
      url: `/pms/supplier/querySupplierById?id=${id}`,
      method: 'get',
    })
  },
  // 审核详情
  queryExamineById(id) {
    return request({
      url: `/pms/supplier/queryExamineById?id=${id}`,
      method: 'get',
    })
  },
  // 查看操作日志信息
  queryOperatorById(id) {
    return request({
      url: `/pms/supplier/queryOperatorById?id=${id}`,
      method: 'get',
    })
  },
  // 添加供应商
  addSupplier(data) {
    return request({
      url: `/pms/supplier/addSupplier`,
      method: 'post',
      data: data,
    })
  },
  // 修改供应商
  updateSupplier(data) {
    return request({
      url: `/pms/supplier/editSupplier`,
      method: 'put',
      data: data,
    })
  },
  // 导入
  importSupplier(data) {
    return request({
      url: `/pms/supplier/importSupplierInfo`,
      method: 'post',
      data: data,
    })
  },
  //导入
  importSupplierInfo(data) {
    return request({
      url: `/pms/goods/importGoodsInfo`,
      method: 'post',
      data: data,
    })
  },
  exportSupplier(data) {
    return download(`/pms/supplier/export`,data,`供应商信息_${new Date().getTime()}.xlsx`)
  },
  exportFiles(data){
    return download(`/pms/goods/export`,data,`物品信息_${new Date().getTime()}.xlsx`)
  },
  downloadTemplate() {
    return download(`/pms/examine/downloadTemplate?type=0`,{},`供应商信息模板_${new Date().getTime()}.xlsx`)
  },
  downloadSupperlierTemplate() {
    return download(`/pms/examine/downloadTemplate?type=1`,{},`物品导入模板_${new Date().getTime()}.xlsx`)
  },
  // 启用，停用，淘汰
  enableSupplier(params) {
    return request({
      url: `/pms/supplier/enableSupplier`,
      method: 'put',
      data: params
    })
  },
  // 审核通过、不通过、撤回
  auditSupplier({supplierId, examineType,remark}) {
    return request({
      url: `/pms/supplier/examineSupplier`,
      method: 'post',
      data: {
        supplierId, examineType,remark
      }
    })
  },
  // 删除供应商(伪删除）
  deleteSupplier(supplierId) {
    return request({
      url: `/pms/supplier/deleteSupplierById?supplierId=${supplierId}`,
      method: 'put'
    })
  },
  // 删除供应商指定附件
  deleteAttachment(attachmentId) {
    return request({
      url: `/pms/supplier/deleteAttachmentId?attachmentId=${attachmentId}`,
      method: 'delete'
    })
  },
}

export default supplierApi
