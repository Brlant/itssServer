import request from '@/utils/request';



// 接口前缀
const PREFIX = '/pms/order'

// 查询列表
const ORDER_LIST = PREFIX + '/queryOverview'

const outBoundOrderApi = {
  queryList(data) {
    return request({
      url: ORDER_LIST,
      method: 'post',
      data:data,
    })
  },
}

export default outBoundOrderApi;
