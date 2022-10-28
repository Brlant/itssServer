import http from '@/utils/http' ;

let reqList         =   config => http( `/system/org/treeSelect`, config ),
    add             =   config => http( `/system/org/add`, config ),
    remove          =   config => http( `/system/org/${ config.id }`, config ),
    status          =   config => http( `/system/org/getStatus`, config ),
    changeStatus    =   config => http( `/system/org/changeStatus/${ config.id }/${ config.status }`, config ),
    update          =   config => http( `/system/org/update`, config ) ;

export { reqList, add, remove,  status, changeStatus, update } ;