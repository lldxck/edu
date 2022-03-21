import Vue from 'vue'
import Vuex from 'vuex'
import { userMenu } from 'services/login'
import statusCode from 'constants/statusCode'
import status from 'constants/status'
import utils from 'utils/utils'
import { routes, asyncRoutes } from 'router'
import router from 'router'
import _ from 'lodash'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 动态路由
    asyncRoutesResult: [],
    totalRoutes: [],
  },
  mutations: {
    async setTotalRoutes(state, routerArr) {
      state.asyncRoutesResult = routerArr
      state.totalRoutes = [...routes, ...routerArr]
      // 持久化存储动态菜单路由
      localStorage.setItem('menuRoutes', JSON.stringify(routerArr))
      await router.addRoutes(state.totalRoutes)
    }
  },
  actions: {
    async getRoutes({ commit }) {
      let arr = []
      const res = await userMenu()
      if (res.code == statusCode.SUCCESS) {
        console.log('获取菜单', res)
        // 获取用户的菜单
        const menuList = res.data.menuList
        arr = _.cloneDeep(asyncRoutes).filter(item => {
          if (menuList.indexOf(item.name) != -1) {
            item.children = item.children.filter(cItem => {
              if (menuList.indexOf(cItem.name) != -1) {
                return true
              }
            })
            return true
          }
        })
        const newArr = arr.filter(item => {
          if (item.isHasChild && item.children.length == 0) {
            return false
          } else {
            return true
          }
        })
        console.log(newArr)
        await commit('setTotalRoutes', newArr)
        return true
      } else {
        utils.showMessage(status.ERROR, res.message)
        return false
      }
    }
  },
  modules: {
  }
})