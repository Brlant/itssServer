import request from '@/utils/request'
//待处理
export function getPendingList(query) {
    return request({
      url: `flowable/flowable/task/todoList`,
      method: 'get',  
      params:query   
    })
  }
  //已处理
  export function getProcessedList(query) {
    return request({
      url: `flowable/flowable/task/finishedList`,
      method: 'get',  
      params:query      
    })
  }
  //查询人员
  export function getPeople() {
    return request({
      url: '/system/user/listByDeptId',
      method: 'get',  
            
    })
  }