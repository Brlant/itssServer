import request from '@/utils/request'

// 新增单位
export function addUnit(data) {
    return request({ 
      url: '/system/unit',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'post',
      data: data,
    })
  }


  // 单位列表
  export function listUnit(data) {
    return request({
      url: `/system/unit/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&unitName=${data.unitName}&unitStatus=${data.unitStatus}`,
      method: 'get'
    })
  }


  // 启用 禁用
  export function updateUnit(data) {
    return request({
      url: `/system/unit/updateStatus?unitIds=${data.unitIds}&unitStatus=${data.unitStatus}`,
      method: 'put'
    })
  }


  // 开通产品
  export function openProduct(data) {
    return request({
      url: `/system/unit/${data.unitId}?roleIds=${data.roleIds}`,
      method: 'put'
    })
  }

  // 详情

  export function getUnit(unitId) {
    return request({
      url: `/system/unit/${unitId}`,
      method: 'get'
    })
  }

  // 单位列表（白名单）
  export function userUnitList(data,type) {
    return request({
      url: `/system/unit/userUnitList?type=${type}`,
      method: 'get',
      data:data
    })
  }