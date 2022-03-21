import axios from 'axios'
import router from 'router'
import utils from 'utils/utils'
import status from 'constants/status'

export default function request(config) {
  const instance = axios.create({
    baseURL: 'http://39.108.191.93:8888',
    // baseURL: 'http://192.168.1.103:8080',
    timeout: 15000,

  })
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  // 请求拦截
  instance.interceptors.request.use(config => {
    // 添加请求令牌 token
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    if (loginInfo) {
      config.headers.common['Authorization'] = loginInfo.token
    }
    return config
  }, error => {
    return error
  })
  // 响应拦截
  instance.interceptors.response.use(response => {
    return response.data
  }, error => {
    console.log(error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权
          router.replace({ path: '/login' })
          break;
        case 403:
          // token失效
          router.replace({ path: '/login' })
          break;
        case 404:

          utils.showMessage(status.ERROR, '请求的不存在')
          break;
        case 500:
          utils.showMessage(status.ERROR, '服务器出错啦')
          break;
        default:
          utils.showMessage(status.ERROR, '网络异常')
          break;
      }
    }
  })

  return instance(config)
}