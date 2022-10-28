import http from '@/utils/http' ;

let page            =   config => http( '/system/post/page', config ),
    changeStatus    =   config => http( `/system/post/changeStatus/${ config.id }/${ config.status }`, config ), 
    add             =   config => http( `/system/post/add`, config ), 
    update          =   config => http( `/system/post/update`, config ), 
    detail          =   config => http( `/system/post/${ config.id }`, config ), 
    all             =   config => http( `/system/post/list`, config ), 
    remove          =   config => http( `/system/post/delete/${ config.id }`, config ) ;

export { page, changeStatus, add, update, detail, all, remove } ;