import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login'),
  //   hidden: true
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:list'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/unit-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:unit:list'],
    children: [
      {
        path: 'unitAdd',
        component: () => import('@/views/system/unit/unitAdd'),
        name: 'unitAdd',
        meta: { title: '新增单位', activeMenu: '/system/unit' }
      },
      {
        path: 'unitDetail',
        component: () => import('@/views/system/unit/unitDetail'),
        name: 'unitDetail',
        meta: { title: '单位详情', activeMenu: '/system/unit' }
      },
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:list'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      },
      {
        path: 'roleAdd',
        component: () => import('@/views/system/role/roleAdd'),
        name: 'roleAdd',
        meta: { title: '新增角色', activeMenu: '/system/role' }
      },
      {
        path: 'roleDetail',
        component: () => import('@/views/system/role/roleDetail'),
        name: 'roleDetail',
        meta: { title: '查看角色', activeMenu: '/system/role' }
      },
      {
        path: 'roleEdit',
        component: () => import('@/views/system/role/roleEdit'),
        name: 'roleEdit',
        // beforeEnter: (to, from, next) => {
        //   if (to.query.isAdd == 'edit') {
        //     to.meta.title = '编辑角色'
        //   } else if (to.query.isAdd == 'add') {
        //     to.meta.title = '新增角色'
        //   } else {
        //     to.meta.title = '查看角色'
        //   }
        //   next()
        // },
        meta: { title: '编辑角色', activeMenu: '/system/role' }
      },
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/system/carrier-data',
    component: Layout,
    hidden: true,
    permissions: ['carrier:carrier:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'carrier',
        meta: { title: '第三方承运商', activeMenu: '/system/carrier' }
      }
    ]
  },
  {
    path: '/schedule/dispatch-data',
    component: Layout,
    hidden: true,
    permissions: ['control:rule:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'dispatch',
        meta: { title: '调度规则', activeMenu: '/schedule/dispatch' }
      }
    ]
  },
  {
    path: '/document/order-data',
    component: Layout,
    hidden: true,
    permissions: ['tdp:order:list','system:unit:list'],
    children: [
      // {
      //   path: 'index/:dictId(\\d+)',
      //   component: () => import('@/views/system/dict/data'),
      //   name: 'Data',
      //   meta: { title: '订单管理', activeMenu: '/document/order' }
      // }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  },
  {
    path: '/projectManager',
    component: Layout,
    hidden: true,
    permissions: ['projectManager:teamDtail:query'],
    children: [
      {
        path: 'teamDetail',
        component: () => import('@/views/projectManager/teamDetail'),
        name: 'TeamDetail',
        meta: { title: '项目组项目详情', activeMenu: '/projectManager/teamDetail' }
      }
    ]
  },
  {
    path: '/projectManager',
    component: Layout,
    hidden: true,
    permissions: ['projectManager:addTeam:add'],
    children: [
      {
        path: 'addTeam',
        component: () => import('@/views/projectManager/addTeam'),
        name: 'GenEdit',
        meta: { title: '项目组新建', activeMenu: '/projectManager/addTeam' }
      }
    ]
  },
  {
    path: '/projectManager',
    component: Layout,
    hidden: true,
    permissions: ['projectManager:editTeam:edit'],
    children: [
      {
        path: 'editTeam',
        component: () => import('@/views/projectManager/editTeam'),
        name: 'TeamEdit',
        meta: { title: '项目组编辑', activeMenu: '/projectManager/editTeam' }
      }
    ]
  },
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:query'],
    children: [
      {
        path: 'userInfo',
        component: () => import('@/views/system/user/userInfo'),
        name: 'UserInfo',
        meta: { title: '成员信息', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:add'],
    children: [
      {
        path: 'editAddInfo',
        component: () => import('@/views/system/user/editAddInfo'),
        name: 'EditAddInfo',
        meta: { title: '成员信息', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:query'],
    children: [
      {
        path: 'search',
        component: () => import('@/views/system/user/search'),
        name: 'search',
        meta: { title: '人员搜索', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/user-auth/profile',
    component: Layout,
    hidden: true,
    permissions: ['system:user:selfInfo'],
    children: [
      {
        path: 'userEdit',
        component: () => import('@/views/system/user/profile/userEdit'),
        name: 'userEdit',
        meta: { title: '个人资料修改', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/projectManager/proManager-auth',
    component: Layout,
    hidden: true,
    permissions: ['projectManager:proManager:create'],
    children: [
      {
        path: 'addProject',
        component: () => import('@/views/projectManager/addProject'),
        name: 'AddProject',
        meta: { title: '新建项目',noCache:false  }
      }
    ]
  },
  {
    path: '/projectManager/proManager-auth',
    component: Layout,
    hidden: true,
    permissions: ['projectManager:proManager:viewMyPro','projectManager:proManager:viewMemberPro','projectManager:proManager:viewAllPro'],
    children: [
      {
        path: 'proDetails',
        component: () => import('@/views/projectManager/proDetails'),
        name: 'ProDetails',
        meta: { title: '项目详情',noCache:false  }
      }
    ]
  },
  {
    path: '/projectManager/proManager-auth',
    component: Layout,
    hidden: true,
    permissions: ['projectManager:proManager:handle'],
    children: [
      {
        path: 'proEdit',
        component: () => import('@/views/projectManager/proEdit'),
        name: 'ProEdit',
        meta: { title: '编辑项目',noCache:false  }
      }
    ]
  },
  {
    path: '/chanceManager/chanceManager-auth',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:create'],
    children: [
      {
        path: 'addChance',
        component: () => import('@/views/chanceManager/addChance'),
        name: 'AddChance',
        meta: { title: '新建机会',noCache:false  }
      }
    ]
  },
  {
    path: '/chanceManager/chanceManager-auth',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:all'],
    children: [
      {
        path: 'chanceDetails',
        component: () => import('@/views/chanceManager/chanceDetail'),
        name: 'ChanceDetails',
        meta: { title: '机会详情',noCache:false }
      }
    ]
  },
  {
    path: '/chanceManager/chanceManager-auth',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'chanceEdit',
        component: () => import('@/views/chanceManager/chanceEdit'),
        name: 'ChanceEdit',
        meta: { title: '编辑机会',noCache:false  }
      }
    ]
  },
  {
    path: '/assetManagement/companyAssets/companyAssets-auth',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'add',
        component: () => import('@/views/assetManagement/companyAssets/add/index'),
        name: 'add',
        meta: { title: '录入资产', noCache:false  }
      }
    ]
  },
  {
    path: '/assetManagement/assetManagementSet/process',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'addApprovalProcess',
        component: () => import('@/views/assetManagement/assetManagementSet/addApprovalProcess'),
        name: 'AddApprovalProcess',
        meta: { title: '新增审批流程管理',noCache:false  }
      }
    ]
  },
  {
    path: '/assetManagement/assetManagementSet/process',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'editApprovalProcess',
        component: () => import('@/views/assetManagement/assetManagementSet/editApprovalProcess'),
        name: 'editApprovalProcess',
        meta: { title: '编辑审批流程管理',noCache:false  }
      }
    ]
  },
 
  {
    path: '/assetManagement/assetManagementSet/process',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'detailApprovalProcess',
        component: () => import('@/views/assetManagement/assetManagementSet/detailApprovalProcess'),
        name: 'detailApprovalProcess',
        meta: { title: '审批流程管理详情',noCache:false  }
      }
    ]
  },
  {
    path: '/assetManagement/assetManagementSet/process',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'addAssetCodeRules',
        component: () => import('@/views/assetManagement/assetManagementSet/addAssetCodeRules'),
        name: 'addAssetCodeRules',
        meta: { title: '新增资产编号规则',noCache:false  }
      }
    ]
  }, 
  {
    path: '/assetManagement/assetManagementSet/process',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'editAssetCodeRules',
        component: () => import('@/views/assetManagement/assetManagementSet/editAssetCodeRules'),
        name: 'editAssetCodeRules',
        meta: { title: '资产编号规则编辑',noCache:false  }
      }
    ]
  }, 
  {
    path: '/assetManagement/assetManagementSet/process',
    component: Layout,
    hidden: true,
    permissions: ['chanceManage:chance:duty'],
    children: [
      {
        path: 'detailAssetCodeRules',
        component: () => import('@/views/assetManagement/assetManagementSet/detailAssetCodeRules'),
        name: 'detailAssetCodeRules',
        meta: { title: '资产编号规则详情',noCache:false  }
      }
    ]
  }, 

]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}


export default new Router({
  mode: 'hash', //
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
