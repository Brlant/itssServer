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
}

export default filesApi
