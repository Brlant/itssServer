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
// 机会详情，资源配置 点击修改之后 查询内容的
export function getResourceLineDetail(id) {
  return request({
    url: `/opportunityManage/itssChanceConfig/${id}`,
    method: 'get',
    // params: query
  })
}

// 保存点击修改之后的 资源配置接口 修改的
export function updateChanceConfig(data) {
  return request({
    url: '/opportunityManage/itssChanceConfig/updateChanceConfig',
    method: 'put',
    data: data
  })
}
// 删除 当前行的配置 信息
export function delChanceConfigLine(id) {
  return request({
    url: `/opportunityManage/itssChanceConfig/${id}`,
    method: 'delete',
    // params: query
  })
}
// 保存点击新增资源配置之后的 资源配置接口 新增的
export function addChanceConfig(data) {
  return request({
    url: '/opportunityManage/itssChanceConfig/addChanceConfig',
    method: 'post',
    data: data
  })
}



// 跟进记录的列表
export function getFollowList(data) {
  return request({
    url: '/opportunityManage/itssChanceRecord/list',
    method: 'post',
    data: data
  })
}
export function addChanceRecord(data) {
  return request({
    url: '/opportunityManage/itssChanceRecord/addChanceRecord',
    method: 'post',
    data: data
  })
}


