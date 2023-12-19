import request from '@/utils/request';

const filesApi = {
  //物品档案管理查询
  queryFiles(params) {
    return request({
      url: 'pms/goods/queryList',
      method: 'get',
      params
    })
  },
  //新建
  addFiles(data) {
    return request({
      url: '/pms/goods/add',
      method: 'post',
      data
    })
  },
  //详情
  getDetailFiles(params) {
    return request({
      url: `/pms/goods/queryByGoodsId`,
      method: 'get',
      params:params
    })
  },

  //审核信息
  checkFiles(params) {
    return request({
      url: `/pms/goods/queryExamineById`,
      method: 'get',
      params:params
    })
  },
  //操作日志
  getFilesLog(params) {
    return request({
      url: `/pms/goods/queryOperatorById`,
      method: 'get',
      params:params
    })
  },
  //启用停用
  changeStatus(data) {
    return request({
      url: `/pms/goods/editStatus`,
      method: 'post',
      data
    })
  },
  //审核通过
  checkPass(data) {
    return request({
      url: `/pms/goods/examineGoodsInfo`,
      method: 'post',
      data
    })
  },
  //删除
  deleteFiles(data) {
    return request({
      url: `/pms/goods/deleteGoodsById`,
      method: 'put',
      data
    })
  },
  //编辑
  editFiles(data) {
    return request({
      url: `/pms/goods/edit`,
      method: 'post',
      data
    })
  }
}

export default filesApi
