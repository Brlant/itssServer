import store from '@/store'

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    const permissionDatas = value
    const all_permission = "*:*:*";

    const hasPermission = permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value
    const super_admin = "admin";

    const hasRole = roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })

    if (!hasRole) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`)
    return false
  }
}

// export function getCountscope(){
//      // 额外的判断 页面初始化 判断用户的角色  isJurisdiction 判断当前的值是否存在 返回true or false
//     // 部门主管 deptdirector  3
//     // 项目主管 projectdirector 2
//     // 运营管理 operatemanage
//     // 项目监管 管理员 projectsupervision || admin ==>  1
//     let deptdirector = this.isJurisdiction("deptdirector"); // 部门主管
//     let projectdirector = this.isJurisdiction("projectdirector"); // 项目主管
//     let projectsupervision = this.isJurisdiction("projectsupervision"); // 项目监管
//     let operatemanage = this.isJurisdiction("operatemanage"); // 运营管理
//     let admin = this.isJurisdiction("admin"); // 管理员
//     // 运营管理        operatemanage
//     let countScopeOptionsTemp = [],countScopeOptions=[];
//     let countScopeInit = '';
//        if (projectdirector) {
//       // 项目主管
//       countScopeInit = 2
//       countScopeOptionsTemp.push({
//         label: "仅我负责",
//         value: 2,
//       });
//     }
//     if (deptdirector) {
//       // 部门主管
//       countScopeInit = 3
//       countScopeOptionsTemp.push({
//         label: "仅部门成员",
//         value: 3,
//       });
//     }

//     if (projectsupervision || admin|| operatemanage) {
//       // 项目监管 超管 运营管理
//       countScopeInit = 1
//       countScopeOptionsTemp.push({
//         label: "全部",
//         value: 1,
//       });
//     }
//     countScopeOptionsTemp.push({
//         label: "全部",
//         value: 1,
//       });
//     countScopeOptions = countScopeOptionsTemp;
//     return countScopeOptions;
//     // this.searchForm.countScope = 1//this.countScopeInit
//     /*------------------额外的初始化查询的判断------------------------------*/
// }