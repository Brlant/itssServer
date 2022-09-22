import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";  
// parseStrEmpty undefined,null等转化为""

// 查询规则列表
export function listRule(query) {
    return request({
      url: `/business/control-rule/list?controlRuleName=${query.controlRuleName}&ruleState=${query.ruleState}`,
      method: 'get',
    })
  }

// 新增规则
export function addRule(data) {
    return request({
      url: '/business/control-rule',
      method: 'post',
      data: data
    })
  }

// 规则详情
export function getRule(data) {
    return request({
      url: `/business/control-rule/${data}`,
      method: 'get'
    })
  }

  // 编辑 审核 禁用
export function putRule(data) {
    return request({
      url: `/business/control-rule`,
      method: 'put',
      data: data
    })
  }

