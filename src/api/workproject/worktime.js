import request from '@/utils/request'
//查询工时
export function queryTime(query) {
    return request({
      url: '/project/time-track/list',
      method: 'get',
      params: query
    })
  }
  export function projectList() {
    return request({
      url: '/project/project-user/list-working-project',
      method: 'get',
    
    })
  }
  export function workType(query) {
    return request({
      url: '/system/dict/data/type/'+query,
      method: 'get',
      // params: query
    })
  }
  //添加工时
  export function addworkingHour(data) {
    return request({
      url: '/project/time-track',
      method: 'post',
      data: data
    })
  }
  //编辑工时
export function editworkingHour(data) {
    return request({
        url: '/project/time-track',
        method: 'put',
        data: data
    })
}
//删除工时
export function delHour(trackid) {
    return request({
      url: '/project/time-track/' + trackid,
      method: 'delete'
    })
  }
  //获取已填报工时的日期
  export function queryDate(query) {
    return request({
      url: '/project/time-track/listFilledDateFromCheckedMonth',
      method: 'get',
      params: query
    })
  }