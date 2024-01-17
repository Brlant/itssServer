import request from '@/utils/request'

//发起人
const ORDER_PROVIDER = `/system/user/queryUserlist`

const newDemand = {
  //发起人
  queryOrderProvider(data) {
    return request({
      url: ORDER_PROVIDER,
      method: 'POST',
      data
    })
  }
}

export default newDemand;
