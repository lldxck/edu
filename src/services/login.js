import request from './request'
import API from 'constants/api'
import METHOD from 'constants/method'
/**
 * 登录
 * @param {*} params 
 * @returns 
 */
export function login(params) {
    return request({
        url: API.LOGIN,
        method: METHOD.POST,
        data: params
    })
}

/**
 * 退出登录
 * @returns 
 */
export function loginOut() {
    return request({
        url: API.LOGIN_OUT,
        method: METHOD.GET
    })
}


/**
 * 获取用户菜单
 * @returns 
 */
export function userMenu() {
    return request({
        url: API.USER_MENU,
        method: METHOD.GET
    })
}