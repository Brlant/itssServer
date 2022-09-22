import request from '@/utils/request'

// 新增承运商
export function addCarrier(data) {
    return request({ 
      url: '/system/carrier',
    //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'post',
      data: data,
    })
  }


  // 承运商列表
  export function listCarrier(data) {
    return request({
      url: `/system/carrier/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}&carrierName=${data.carrierName}&status=${data.status}&transportType=${data.transportType}`,
      method: 'get'
    })
  }


  // 启用 禁用 
  export function updateCarrier(data) {
    return request({
      url: `/system/carrier`,
      method: 'put',
      data:data
    })
  }

  // 编辑 
  export function editCarrier(data) {
    return request({
      url: `/system/carrier`,
      method: 'put',
      data:data
    })
  }

  // 详情

  export function getCarrier(carrierId) {
    return request({
      url: `/system/carrier/${carrierId}`,
      method: 'get'
    })
  }

 //  可以远程搜索承运商

export function getCarriers(carrierName) {
    return request({
      url: `/system/carrier/getCarriers`,
      method: 'get',
      data:carrierName,
    })
  }