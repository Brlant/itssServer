import axios from 'axios' ;
import { getToken } from '@/utils/auth'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import router from '@/router'
import errorCode from '@/utils/errorCode'
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
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = res.data.msg || errorCode[code]  || errorCode['default']
    // 二进制数据则直接返回
    if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
      return res.data
    }
    if (code === 401) {
    //   if (!isRelogin.show) {
    //     isRelogin.show = true;
    //     MessageBox.confirm(msg, '系统提示', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     isRelogin.show = false;
    //     store.dispatch('LogOut').then(() => {
    //       this.$router.push('/login');
    //     })
    //   }).catch(() => {
    //     isRelogin.show = false;
    //   });
    // }
      // TODO
      Message.closeAll()
      Message.error(msg)
      store.dispatch('LogOut').then(() => {
        router.push('/login');
      })
      return Promise.reject(msg)
      // return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
}, err => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
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
