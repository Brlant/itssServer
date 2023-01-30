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
  //同意
  export function agreeQuery(data) {
    return request({
      url: `flowable/flowable/task/complete`,
      method: 'post',  
      data  
    })
  }
  //拒绝
  export function rejectQuery(data) {
    return request({
      url: `flowable/flowable/task/return`,
      method: 'post',  
      data    
    })
  }
  //上传附件
  export function uploadSuccess(data) {
    return request({
      url: `flowable/flowable/task/addAttachment`,
      method: 'post',  
      data  
    })
  }
  //删除附件
  export function deleteAttachment(attachmentId) {
    return request({
      url: `flowable/flowable/task/deleteAttachment?attachmentId=${attachmentId}`,
      method: 'post',  
       
    })
  } 
  //查看流程图
  export function seeFlow(query) {
    return request({
      url: `flowable/flowable/task/flowViewer`,
      method: 'get',  
       params:query
    })
  } 
  
// 待分配资产
export function assigned(query) {
  return request({
    url: `/asset/asset/listToBeAssigned`,
    method: 'get',  
     params:query
  })
}
