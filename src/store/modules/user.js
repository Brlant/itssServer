import { login, logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken, getUserKey,setUserKey,removeUserKey,} from '@/utils/auth'
// this丢失，消息弹窗直接使用
import { Message,MessageBox,Alert} from 'element-ui' 
import router from './../../router'

const user = {
  state: {
    token: getToken(),
    name: '',
    user:getUserKey(),
    avatar: '',
    roles: [],
    permissions: [],
    updatePassFlag:false,
    deptId:'',
    deptTitle:''
  },

  mutations: {
    SET_DEPTID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_DEPTTITLE: (state, deptTitle) => {
      state.deptTitle = deptTitle
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    update_PassFlag:(state,updatePassFlag)=>{
      state.updatePassFlag = updatePassFlag
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
        // login(username, password).then(res => {
          let data = res.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          setExpiresIn(data.expires_in)
          commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      // const _router = window.Vue.$router
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          window.localStorage.setItem("user",JSON.stringify(res.user))
          // JSON.parse(window.getItem('queryParam'));
          // JSON.parse(window.localStorage.getItem("user"))
          window.localStorage.setItem("permissions",JSON.stringify(res.permissions))
          window.localStorage.setItem("roles",JSON.stringify(res.roles))
          // 存值 是否修改密码
          if(res && res.updatePassFlag){
            commit('update_PassFlag', res.updatePassFlag)
            if(res.updatePassFlag && (router.history._startLocation.search('/user/profile') === -1)){
              MessageBox.alert('您当前登录密码使用已超过' + res.passwordRule + '天，为保证您的账号安全，请立即修改。', '安全提示', {
                confirmButtonText: '去修改', center: true, showClose: false
              }).then(() => {              
                router.push({ path: "/user/profile",query:{type:'resetPwd'}});
              }).catch(err => {
                console.log("加载alert异常", err)
              });
            }
          }
          const user = res.user
          const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_USER', user)
          commit('SET_AVATAR', avatar)
          setUserKey(user)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data)
          commit('SET_EXPIRES_IN', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_USER', null)
          removeToken()
          removeUserKey()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        commit('SET_USER', null)
        removeUserKey()
        resolve()
      })
    }
  }
}

export default user
