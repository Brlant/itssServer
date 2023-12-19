import request from '@/utils/request'

const categoryApi = {
  getCategoryList(params) {
    return request({
      url: `/system/category/list`,
      method: 'get',
      params: params,
    })
  },
  // 新增
  addCategory(data) {
    return request({
      url: `/system/category/add`,
      method: 'post',
      data: data,
    })
  },
  //编辑
  updateCategory(data) {
    return request({
      url: `/system/category/edit`,
      method: 'put',
      data: data,
    })
  },
  //删除
  deleteCategory(data) {
    return request({
      url: `/system/category/delete`,
      method: 'put',
      data: data,
    })
  },
}

export default categoryApi
