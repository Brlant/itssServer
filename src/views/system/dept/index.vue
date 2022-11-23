<template>
    <div>

        <!--
            <sinopharm-dept-manage /> 组件:
                绑定属性 :  
                    isLoaded <Boolean>      :   【 必须: 否 】列表数据是否在加载, true : 加载中       false : 不加载
                    isSearch <Boolean>      :   【 必须: 否 】是否可搜索, true : 不可搜索       false : 可搜索
                    statusList <Array>      :   【 必须: 是 】部门状态列表数据
                    postList <Array>         :   【 必须: 是 】关联岗位列表数据
                    listData <Array>        :   【 必须: 是 】部门列表数据
                    orgData <Array>        :   【 必须: 是 】关联机构列表数据
                    parentDeptData <Array>   :   【 必须: 是 】上级部门列表数据
                        
                        
                绑定函数:
                    @add <Function>         :   新增部门时
                    @edit <Function>        :   编辑部门时
                    @remove <Function>      :   删除某部门时
                    @status <Function>      :   部门状态更改时
                    @refresh <Function>     :   当点击手动更新列表数据时
                    @detail <Function>      :   当点击详情时
                    @search <Function>      :   当搜索时

        -->

        <sinopharm-dept-manage
            :isLoaded = 'isLoaded'
            :isSearch = 'isSearch'
            :statusList = 'statusList'
            :postList = 'postList'
            :listData = 'listData'
            :orgData = 'orgData'
            :parentDeptData = 'parentDeptData'
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
    import { tree, add, update, remove, deptStatus } from '@/api/DeptMange/DeptManage.js' ;
    import { reqList, status } from '@/api/OrgManage/OrgManage.js' ; // 导入机构请求
    import { all }  from '@/api/PostManage/PostManage.js' ; // 导入岗位请求
    
    export default {
        name : 'testDept',
        data(){
            return {
                isLoaded : false,
                isSearch : false,
                statusList : [],
                postList : [],
                parentDeptData : [],
                orgData : [],
                listData : []
            }
        },
        mounted(){
            this.initFn() ;
        },
        methods : {
            initFn(){
                this.reqDeptListFn() ; // 请求部门列表数据 
                this.reqOrgListFn() ; // 请求机构列表数据 
                this.reqAllListFn() ; // 请求岗位列表数据 
                this.reqParentDeptFn() ; // 请求父级部门 数据
                this.reqStatusFn() ; // 请求部门状态 数据
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
                    console.error( err ) ;
                } );
            },
            reqAllListFn(){
                all({})
                .then( d => {
                    if( d.code === 200 ){
                        if( d.data ){
                            this.postList = d.data ;
                        }
                    }
                    
                } )
                .catch( err => {
                    console.error( err ) ;
                } );
            },
            reqOrgListFn(){
                let reqObj = {} ;

                // 测试数据
                reqObj.headers = { 
                    userId : 1, // 当前登陆用户 ID         < 必填 >
                    orgId : 3 // 当前登陆人的所属机构 ID    < 必填 >
                } ;

                reqList( reqObj )
                .then( d => {
                    if( d.code === 200 ){
                        this.orgData = d.data ;
                    }
                    
                } )
                .catch( err => {
                    console.error( err ) ;
                } );
            },
            reqDeptListFn( data ){
                console.log(data,'data')
                let reqObj = {} ;

                this.isLoaded = true ;
                this.isSearch = true ;

                // 测试数据
                reqObj.headers = { 
                    userId : 1, // 当前登陆用户 ID   < 必填 >
                    deptId : 1 // 当前登陆人的部门 ID   < 必填 >
                } ;

                if( data ){
                    reqObj.params =  { ...data } ;
                }

                tree( reqObj )
                .then( d => {
                    this.isLoaded = false ;
                    this.isSearch = false ;
                    if( d.code === 200 ){
                        this.listData = d.data ;
                       
                    }
                } )
                .catch( err => {
                    console.error( err ) ;
                    this.isLoaded = false ;
                    this.isSearch = false ;
                } );
            },
            reqParentDeptFn(){
                console.log(1111111111111,'ssss')
                let reqObj = {} ;
                

                // 测试数据
                reqObj.headers = { 
                    userId : 1, // 当前登陆用户 ID   < 必填 >
                    deptId : 1 ,// 当前登陆人的部门 ID   < 必填 >
                   
                } ;
                reqObj.orgId=1
                let _fn = arr => {
                    let result = arr ;

                    result.forEach((item) => {

                        // 有无children项
                        if (item.children && item.children.length !== 0) {
                            let newChildren = [];
                            newChildren = _fn( item.children ) ;
                            item.children = newChildren;
                        } else {
                            if (item.type !== 2 ) { // 非部门类型数据
                                item.disabled = true;
                            } else {  // type : 2 为部门数据, 只有部门数据可选择
                                item.disabled = false;
                            }
                        }
                    });

                    return result;

                } ;

                tree( reqObj )

                .then( d => {
                    if( d.code === 200 ){
                        this.parentDeptData = _fn( d.data ) ;
                    }
                } )
                .catch( err => {
                    console.error( err ) ;
                } );
            },
            reqDeptStatusFn( data ){
                deptStatus( { method : 'post', ...data} )
                .then( d => {

                    if( d.code === 200 ){
                        this.reqDeptListFn() ; // 刷新列表数据
                    }

                    this.$message({
                        message: d.code === 200 ? '修改成功!' : '修改异常!' ,
                        type: d.code === 200 ? 'success' : 'warning'
                    });
                } )
                .catch( err => {
                    console.error( err ) ;
                } );
            },
            reqUpdateFn( data ){
                update( { method : 'put', data : data.form || {} } )
                .then( d => {
                    let { msg } = d ;
                    if( d.code === 200 ){
                        this.reqDeptListFn() ; // 刷新列表数据
                         this.reqParentDeptFn()
                    }

                    this.$message({
                        message: d.code === 200 ? '修改成功!' : msg ,
                        type: d.code === 200 ? 'success' : 'warning'
                    });
                } )
                .catch( err => {
                    console.error( err ) ;
                } );
            },
            reqRemoveFn( data ){
                remove( { method : 'delete', id:data  } )
                .then( d => {

                    if( d.code === 200 ){
                        this.reqDeptListFn() ; // 刷新列表数据
                        this.reqParentDeptFn();
                    }

                    this.$message({
                        message: d.code === 200 ? '删除成功!' : '删除异常!' ,
                        type: d.code === 200 ? 'success' : 'warning'
                    });
                } )
                .catch( err => {
                    console.error( err ) ;
                } );
            },
            reqAddFn( data ){
                add( { method : 'post', data : data.form || {}  })
                .then( d => {

                    if( d.code === 200 ){
                        this.reqDeptListFn() ; // 刷新列表数据
                        this.reqParentDeptFn()
                    }

                    this.$message({
                        message: d.code === 200 ? '新增成功!' : '新增异常!' ,
                        type: d.code === 200 ? 'success' : 'warning'
                    });
                } )
                .catch( err => {
                    console.error( err ) ;
                } );
            },
            searchFn( data ){
                this.reqDeptListFn( data.filter ) ;
            },
            addFn( data ){
                this.reqAddFn( data ) ;
            },
            editFn( data ){
                this.reqUpdateFn( data ) ;
            },
            removeFn( data ){
                console.log('111', data)
                this.reqRemoveFn( data.id ) ;
            },
            statusFn( data ){
                // console.log(data.row.id,'data')
                this.reqDeptStatusFn( data.row ) ;
            },
            refreshFn( data ){
                this.reqDeptListFn( data.filter ) ;
            },
            detailFn( data ){
            },
        }
    } ;
</script>
