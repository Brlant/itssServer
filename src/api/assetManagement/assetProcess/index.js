import request from '@/utils/request'
//待处理
export function getPendingList(query) {
    return request({
      url: `flowable/flowable/task/todoList?pageNum=${query.pageNum}&pageSize=${query.pageSize}&userKey=${query.userId}`,
      method: 'get',     
    })
  }
  //已处理
  export function getProcessedList(query) {
    return request({
      url: `flowable/flowable/task/finishedList?pageNum=${query.pageNum}&pageSize=${query.pageSize}&userKey=${query.userId}`,
      method: 'get',     
    })
  }