import request from './request'
import API from 'constants/api'
import METHOD from 'constants/method'

/**
 * 角色列表
 * @returns 
 */
export function list() {
    return request({
        url: API.ROLE_LIST,
        method: METHOD.GET,
    })
}

/**
 * 添加角色
 * @param {*} params 
 * @returns 
 */
export function save(params) {
    return request({
        url: API.ROLE_SAVE,
        method: METHOD.POST,
        data: params,
    })
}

/**
 * 修改角色
 * @param {*} params 
 * @returns 
 */
export function update(params) {
    return request({
        url: API.ROLE_UPDATE,
        method: METHOD.POST,
        data: params,
    })
}

/**
 * 删除角色
 * @param {*} id 
 * @returns 
 */
export function del(id) {
    return request({
        url: API.ROLE_DELETE,
        method: METHOD.GET,
        params: { id }
    })
}

/**
 * 根据角色id获取权限
 * @param {*} roleId 
 * @returns 
 */
export function getPermssionByRoleId(roleId) {
    return request({
        url: API.ROLE_GETPERMISSIONBYROLEID,
        method: METHOD.GET,
        params: { roleId }
    })
}

/**
 * 保存角色权限
 * @param {*} params 
 * @returns 
 */
export function setPermissions(params) {
    return request({
        url: API.ROLE_SETPERMISSIONS,
        method: METHOD.POST,
        data: params
    })
}