<template>
    <div>
        <!--
            <sinopharm-org-manage /> 机构管理 组件:
                绑定属性 :
                    isLoaded <Boolean>      :   【 必须: 否 】列表数据是否在加载, true : 加载中       false : 不加载
                    isSearch <Boolean>      :   【 必须: 否 】是否可搜索, true : 不可搜索       false : 可搜索
                    isRefList <Boolean>     :   【 必须: 否 】是否刷新列表, true : 刷新列表中       false : 刷新列表后
                    statusList <Array>      :   【 必须: 是 】机构状态列表数据
                    listData <Array>        :   【 必须: 是 】机构列表数据
                    parentOrgData <Array>   :   【 必须: 是 】上级机构列表数据


                绑定函数:
                    @add <Function>         :   新增机构时
                    @edit <Function>        :   编辑机构时
                    @remove <Function>      :   删除某机构时
                    @status <Function>      :   机构状态更改时
                    @refresh <Function>     :   当点击手动更新列表数据时
                    @search <Function>      :   当搜索时
                    @detail <Function>      :   当点击详情时

        -->

        <sinopharm-org-manage
            :isLoaded = 'isLoaded'
            :isSearch = 'isSearch'
            :isRefList = 'isRefList'
            :statusList = 'statusList'
            :listData = 'listData'
            :parentOrgData = 'parentOrgData'
            :isShowStatus = 'isShowStatus'
            @add="addFn"
            @edit="editFn"
            @remove="removeFn"
            @status="statusFn"
            @refresh="refreshFn"
            @detail="detailFn"
            @search="searchFn"
        />
    </div>
</template>
<script>
    import { reqList, add, remove, status, changeStatus, update } from '@/api/OrgManage/OrgManage.js' ;

    export default {
        name : 'testOrg',
        data(){
            return {
                isLoaded : false,
                isSearch : false,
                isRefList : false,
                statusList : [],
                parentOrgData : [],
                listData : [],
                isShowStatus: true

            }
        },
        mounted(){
            this.initFn() ;
        },
        methods : {
            initFn(){
                this.reqListFn() ; // 请求列表数据
                this.reqParentFn() ; // 请求父级机构数据
                this.reqStatusFn() ; // 请求状态树数据
            },
            reqListFn( data ){
                let reqObj = {} ;

                this.isLoaded = true ;
                this.isSearch = true ;

                // 测试数据
                reqObj.headers = {
                    userId : 1, // 当前登陆用户 ID
                    orgId : 3 // 当前登陆人的所属机构 ID
                } ;

                if( data ){
                    reqObj.params =  { ...data } ;
                }

                reqList(reqObj)
                .then( d => {
                    this.isLoaded = false ;
                    this.isRefList = false ;
                    this.isSearch = false ;
                    this.listData = d.data ;
                } )
                .catch( err => {
                    this.isRefList = false ;
                    this.isLoaded = false ;
                    this.isSearch = false ;
                } );
            },
            reqParentFn( ){
                this.isLoaded = true ;

                reqList({
                    // 测试数据
                    headers : {
                        userId : 1, // 当前登陆用户 ID
                        orgId : 1 // 当前登陆人的所属机构 ID
                    }
                })
                .then( d => {
                    this.parentOrgData = d.data ;
                } )
                .catch( err => {
                } );
            },
            reqStatusFn(){
                status({})
                .then( d => {
                    if( d.code === 200 ){
                        if( d.data ){
                            let statusArr = [] ;
                            for( let a in d.data ){
                                statusArr.push({
                                    label : d.data[ a ],
                                    value : +a
                                }) ;
                            }
                            this.statusList = statusArr ;
                        }
                    }

                } )
                .catch( err => {
                } );
            },
            searchFn( data ){
                this.reqListFn( data.filter ) ; // 请求列表数据
            },
            addFn( data ){
                this.isLoaded = true ;
                add({ method : 'post', data : data.form || {} })
                .then( d => {
                    this.isLoaded = false ;

                    if( d.code === 200 ){
                        this.reqListFn() ; // 刷新列表数据
                    }

                    this.$message({
                        message: d.code === 200 ? '添加成功!' : '添加异常!' ,
                        type: d.code === 200 ? 'success' : 'warning'
                    });

                } )
                .catch( err => {
                    this.isLoaded = false ;
                } );
            },
            editFn( data ){
                update({ method : 'put', data : data.form })
                .then( d => {
                    this.isLoaded = false ;

                    if( d.code === 200 ){
                        this.reqListFn() ; // 刷新列表数据
                    }

                    this.$message({
                        message: d.code === 200 ? '编辑成功!' : '编辑异常!' ,
                        type: d.code === 200 ? 'success' : 'warning'
                    });

                } )
                .catch( err => {
                    this.isLoaded = false ;
                } );
            },
            removeFn( data ){
                remove({ method : 'delete', id : data.row.id })
                .then( d => {
                    this.isLoaded = false ;

                    if( d.code === 200 ){
                        this.reqListFn() ; // 刷新列表数据
                    }

                    this.$message({
                        message: d.code === 200 ? '删除成功!' : '删除异常!' ,
                        type: d.code === 200 ? 'success' : 'warning'
                    });

                } )
                .catch( err => {
                    this.isLoaded = false ;
                } );
            },
            reqChangeStatusFn( data ){
                changeStatus({ method : 'post', ...data })
                .then( d => {
                    this.isLoaded = false ;

                  /* if( d.code === 200 ){
                       this.reqListFn() ; // 刷新列表数据
                   }

                   this.$message({
                       message: d.code === 200 ? '修改成功!' : '修改异常!' ,
                       type: d.code === 200 ? 'success' : 'warning'
                   });*/

                  this.reqListFn() ; // 刷新列表数据
                  this.$message({
                    message: d.msg,
                    type: d.code === 200 ? 'success' : 'warning'
                  });

                } )
                .catch( err => {
                  this.reqListFn() ; // 刷新列表数据
                    this.isLoaded = false ;
                } );
            },
            deleteFn( data ){
            },
            statusFn( data ){
                this.reqChangeStatusFn( data.row ) ;
            },
            refreshFn( data ){
                this.isRefList = true ;
                this.reqListFn( data.filter ) ; // 请求列表数据
            },
            // pageFn( data ){
            //     console.error( 'page: ', data ) ;
            // },
            detailFn( data ){
                // console.error( 'detail : ', data ) ;
            },
        }
    } ;
</script>
