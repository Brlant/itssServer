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
// 详情页面，点击编辑进入编辑页面
export function proDetailBFEdit(projectId) {
  return request({
    url: `/projectManage/project/getById/${projectId}`,
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
