import request from './request'
import API from 'constants/api'
import METHOD from 'constants/method'

/**
 *  菜单列表
 * @returns 
 */
export function list() {
    return request({
        url: API.PERMISSION_LIST,
        method: METHOD.GET,
    })
}

/**
 * 添加菜单
 * @param {*} params 
 * @returns 
 */
export function save(params) {
    return request({
        url: API.PERMISSION_SAVE,
        method: METHOD.POST,
        data: params
    })
}

export function update(params) {
    return request({
        url: API.PERMISSION_UPDATE,
        method: METHOD.POST,
        data: params
    })
}
export function del(id) {
    return request({
        url: API.PERMISSION_DELETE,
        method: METHOD.GET,
        params: { id }
    })
}