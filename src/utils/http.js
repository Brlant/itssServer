import axios from 'axios' ;
import { getToken } from '@/utils/auth'
let   configObj =   {
                        baseURL : process.env.VUE_APP_BASE_API,
                        // baseURL : '/api',
                        // baseURL : 'http://192.168.5.16:8111/',
                        // headers : {},
                        timeout : 30000
                    }
    , axiosObj  =   axios.create( configObj )
    , reqFn     =   null ;

axiosObj.interceptors.request.use( config => {
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      }
    // TO DO SOMETHING...
    return config ;
}, err => {
    return Promise.reject( err ) ;
} ) ;

axiosObj.interceptors.response.use( res => {
    // TO DO SOMETHING...
    return res ;
}, err => {
    return Promise.reject( err ) ;
} ) ;

reqFn = ( url, reqObj ) => {

    if( reqObj ){
        if( url && !reqObj.url ){ reqObj.url = url ; }
        if( !reqObj.method ){ reqObj.method = 'get' ; }
    } else {
        reqObj = { url : url, method : 'get' } ;
    }
    

    return new Promise( ( resolve, reject ) => {

        axiosObj( reqObj )
        .then( d => {
            resolve( d.data ) ;
        } )
        .catch( err => {
            reject( err ) ;
        } ) ;
    } ) ;

} ;

reqFn.configObj = configObj ;

export default reqFn ;
