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
import { parseStrEmpty } from "@/utils/ruoyi";


 let assetManagement = {
      /**
      * @description 资产详情字典，获取资产详情字典表格数据
      */
       detailDitaionaryTable (params) {
         return request.get("/asset/dict/queryAll", {params})
     },
 
     /**
      * @description 资产详情字典，查询单条字典详情数据
      */
     dictionarysinglequery(params) {
         return request.get("/asset/dict/queryById", {params})
     },
     /**
      * @description 资产详情字典，查询单条字典详情数据
      */
     createDictionary(params){
         return request.post("/asset/dict/create", params)
     },
     /**
      * @description 公司资产，资产列表，新增页面时根据选择的设备分类进行查询
      */
     queryclassification(params){
         return request.get("/asset/dict/queryDictByThreeId", {params})
     },
     
     /**
      * @description 资产详情字典，表格状态值修改
      */
     updateStatus(params){
         return request.post("/asset/dict/updateStatus", params)
     },
     /**
      * @description 资产详情字典，删除数据
      */
     deleteDictionary(params){
         return request.get("/asset/dict/delete", {params})
     },
     /**
      * @description 资产类型管理，新增分类，查询启用的资产模板
      */
     openAssetTemplate(params){
         return request.post("/asset/dict/queryUpStatus", {params})
     },
     /**
      * @description 资产类型管理，查询字典详情字典模板状态，是否可以删除
      */
      queryDictionaryStatus(params){
         return request.get("asset/dict/checkStatus", {params})
     }
 };
 export default assetManagement;
 