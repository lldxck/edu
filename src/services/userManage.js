import request from './request'
import API from 'constants/api'
import METHOD from 'constants/method'

/**
 * 用户列表
 * @returns 
 */
export function list() {
    return request({
        url: API.USER_LIST,
        method: METHOD.GET
    })
}

/**
 * 添加用户
 * @param {*} params 
 * @returns 
 */
export function save(params) {
    return request({
        url: API.USER_SAVE,
        method: METHOD.POST,
        data: params
    })
}

/**
 * 修改用户
 * @param {*} params 
 * @returns 
 */
export function update(params) {
    return request({
        url: API.USER_UPDATE,
        method: METHOD.POST,
        data: params
    })
}

/**
 * 删除用户
 * @param {*} id 
 * @returns 
 */
export function del(id) {
    return request({
        url: API.USER_DELETE,
        method: METHOD.GET,
        params: { id }
    })
}

/**
 * 根据用户id获取角色
 * @param {*} id 
 * @returns 
 */
export function findRolesByUid(id) {
    return request({
        url: API.FINDROLESBYUID,
        method: METHOD.GET,
        params: { id }
    })
}

/**
 * 设置角色
 * @param {*} params 
 * @returns 
 */
export function setRoles(params) {
    return request({
        url: API.SETROLES,
        method: METHOD.POST,
        data: params
    })
}