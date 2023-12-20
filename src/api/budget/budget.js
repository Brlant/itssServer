import request from '@/utils/request';

const budgetApi = {
  //查询
  queryBudget(params) {
    return request({
      url: `/system/budget/list`,
      method: 'get',
      params:params,
    })
  },
  //新增
  addBudget(data) {
    return request({
      url: `/system/budget/add`,
      method: 'post',
      data:data
    })
  },
  //编辑
  updateBudget(data) {
    return request({
      url: `/system/budget/edit`,
      method: 'put',
      data:data
    })
  },
  //删除
  deleteBudget(data) {
    return request({
      url: `/system/budget/delete`,
      method: 'put',
      data: data,
    })
  },
}

export default budgetApi;
