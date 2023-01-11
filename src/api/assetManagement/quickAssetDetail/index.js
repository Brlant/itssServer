/* * @Date: 2022-08-23 15:40:21 * @LastEditors: hefei_wangyanwei
1562216678@qq.com * @LastEditTime: 2022-09-02 16:35:52 * @FilePath:
\sts-web\src\api\components\assetManagement.ts */
/** * @description
资产管理请求接口 */
import request from '@/utils/request'
import {
  parseStrEmpty
} from "@/utils/ruoyi";
// import {queryAll,searchDetail,createInfo,updateOrDelete}  from '@/api/'
// 
/** * 列表查询-分页 GET /asset/assetTemplateInfo/list
接口ID：56815680
接口地址：https://www.apifox.cn/web/project/1611498/apis/api-56815680 */
export function queryAll(data) {
  return request({
    url: "/asset/assetTemplateInfo/list",
    method: 'post',
    data
  })
}
/** *
@description cha 详情接口 GET /asset/assetTemplateInfo/{id} 接口ID：56817609
接口地址：https://www.apifox.cn/web/project/1611498/apis/api-56817609 */
export function searchDetail(id) {
  return request({
    url: `/asset/assetTemplateInfo/${id}`,
    method: 'get',
  })
}
/** * @description
新增接口 POST /asset/assetTemplateInfo/add 接口ID：56819162
接口地址：https://www.apifox.cn/web/project/1611498/apis/api-56819162 */
export function createInfo(data) {
  return request({
    url: "/asset/assetTemplateInfo/add",
    method: 'post',
    data: data
  })
}
/** *
@description 删除和修改的方法 * 修改接口 PUT /asset/assetTemplateInfo/update
接口ID：56819220
接口地址：https://www.apifox.cn/web/project/1611498/apis/api-56819220 */
export function updateOrDelete(data) {
  return request({
    url: '/asset/assetTemplateInfo/update',
    method: 'put',
    data: data
  })
}

// 查询资产类型
export function queryAsset(params) {
  return request({
    url: '/asset/assetType/tree',
    method: 'get',
    params: params
  })
}
