/*
 * @Date: 2022-08-23 15:40:21
 * @LastEditors: hefei_wangyanwei 1562216678@qq.com
 * @LastEditTime: 2022-09-02 16:35:52
 * @FilePath: \sts-web\src\api\components\assetManagement.ts
 */
/**
 * @description 资产管理请求接口
 */
import request from '@/utils/request'
import {
  parseStrEmpty
} from "@/utils/ruoyi";

/**
 * @description 资产详情字典，新增的
 */
export function createDictionary(data) {
  return request({
    url: "/asset/assetTemplate/add",
    method: 'post',
    data: data
  })
}
/**
 * @description 资产详情字典，获取资产详情字典表格数据
 */
export function queryAll(params) {

  return request({
    url: "/asset/assetTemplate/list",
    method: 'get',
    params: params
  })
}
/**
    * @description 删除和修改的方法
    *  资产模版修改-删除 status传2
      PUT /asset/assetTemplate/update
      接口ID：56468495
      接口地址：https://www.apifox.cn/web/project/1611498/apis/api-56468495
    */
export function updateOrDelete(data) {
  return request({
    url: '/asset/assetTemplate/update',
    method: 'put',
    data: data
  })

}
/**
    * @description cha
    * 资产模版详情
        GET /asset/assetTemplate/{id}
        接口ID：56465974
        接口地址：https://www.apifox.cn/web/project/1611498/apis/api-56465974
    */
      export function searchDetail(id) {
        return request({
          url: `/asset/assetTemplate/${id}`,
          method: 'get',
        })
      
      }
// let assetManagement = {
 
//   /**
//    * @description 资产详情字典，获取资产详情字典表格数据
//    */
//   queryAll(params) {
//     return request.get("/asset/assetTemplate/list", {
//       params
//     })
//   },
//   /**
//       * @description 删除和修改的方法
//       *  资产模版修改-删除 status传2
//         PUT /asset/assetTemplate/update
//         接口ID：56468495
//         接口地址：https://www.apifox.cn/web/project/1611498/apis/api-56468495
//       */
//   updateOrDelete(params) {
//     return request.get("/asset/assetTemplate/update", {
//       params
//     })
//   },

//   /*-------------------------------------------------------------*/
//   /**
//    * @description 资产详情字典，获取资产详情字典表格数据
//    */
//   detailDitaionaryTable(params) {
//     return request.get("/asset/dict/queryAll", {
//       params
//     })
//   },

//   /**
//    * @description 资产详情字典，查询单条字典详情数据
//    */
//   dictionarysinglequery(params) {
//     return request.get("/asset/dict/queryById", {
//       params
//     })
//   },
//   /**
//    * @description 公司资产，资产列表，新增页面时根据选择的设备分类进行查询
//    */
//   queryclassification(params) {
//     return request.get("/asset/dict/queryDictByThreeId", {
//       params
//     })
//   },

//   /**
//    * @description 资产详情字典，表格状态值修改
//    */
//   updateStatus(params) {
//     return request.post("/asset/dict/updateStatus", params)
//   },
//   /**
//    * @description 资产详情字典，删除数据
//    */
//   deleteDictionary(params) {
//     return request.get("/asset/dict/delete", {
//       params
//     })
//   },
//   /**
//    * @description 资产类型管理，新增分类，查询启用的资产模板
//    */
//   openAssetTemplate(params) {
//     return request.post("/asset/dict/queryUpStatus", {
//       params
//     })
//   },
//   /**
//    * @description 资产类型管理，查询字典详情字典模板状态，是否可以删除
//    */
//   queryDictionaryStatus(params) {
//     return request.get("asset/dict/checkStatus", {
//       params
//     })
//   }
// };
// export default assetManagement;
