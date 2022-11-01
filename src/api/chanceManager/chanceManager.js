import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 机会列表首页
export function getChanceList(data) {
  return request({
    url: '/opportunityManage/itssChance/list',
    method: 'post',
    data: data
  })
}
// 机会列表 新增
export function addChance(data) {
  return request({
    url: '/opportunityManage/itssChance/addChance',
    method: 'post',
    data: data
  })
}
// 机会管理详情接口
export function chanceDetail(chanceId) {
  return request({
    url: `/opportunityManage/itssChance/${chanceId}`,
    method: 'get',
    // params: query
  })
}
// 字典查询 传入字典名称
export function queryDict(dictCode) {
  return request({
    url: '/system/dict/data/type/'+dictCode,
    method: 'get',
    // params: query
  })
}
// 转换为正式项目
export function toProject(chanceId) {
  return request({
    url: `/opportunityManage/itssChance/toProject/${chanceId}`,
    method: 'get',
    // params: query
  })
}
 
