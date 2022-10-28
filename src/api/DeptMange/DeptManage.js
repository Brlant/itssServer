import http from '@/utils/http' ;

let tree            =   config => http( '/system/dept/treeSelect', config ),
    add             =   config => http( '/system/dept/add', config ),
    update          =   config => http( '/system/dept/update', config ),
    remove          =   config => http( `/system/dept/${ config.id }`, config ),
    deptStatus      =   config => http( `/system/dept/changeStatus/${ config.id }/${ config.status }`, config ) ;

export { 
    tree,
    add,
    update,
    remove,
    deptStatus
 } ;