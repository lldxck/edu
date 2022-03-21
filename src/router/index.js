import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'

Vue.use(VueRouter)

const Login = () =>
  import('views/Login')
const Home = () =>
  import('views/Home')
const DashBoard = () =>
  import('views/DashBoard')
const UserManage = () =>
  import('views/permission/UserManage')
const RoleManage = () =>
  import('views/permission/RoleManage')
const RolePermission = () =>
  import('views/permission/RolePermission')
const MenuManage = () =>
  import('views/permission/MenuManage')
const CourseList = () =>
  import('views/course/CourseList')
const CourseCategory = () => import('views/course/CourseCategory')
const About = () =>
  import('views/About')
const DataAnalysis = () => import('views/DataAnalysis')

// 常量路由
export const routes = [{
  path: '/',
  redirect: '/login',
},
{
  path: '/login',
  name: 'login',
  component: Login,
},
{
  path: '/dashBoard',
  redirect: '/dashBoard',
  component: Home,
  isHasChild: false,
  meta: {
    title: '首页'
  },
  children: [{
    path: '/dashBoard',
    name: 'dashBoard',
    component: DashBoard,
  }]
},
{
  path: '/about',
  redirect: '/about',
  isHasChild: false,
  component: Home,
  meta: {
    title: '关于'
  },
  children: [{
    path: '/about',
    name: 'about',
    component: About,
  }],

},
  // {
  //   path: '/acl',
  //   name: 'acl',
  //   component: Home,
  //   isHasChild: true,
  //   meta: {
  //     title: '权限管理'
  //   },
  //   children: [{
  //     path: 'user',
  //     name: 'user',
  //     component: UserManage,
  //     meta: {
  //       title: '用户管理'
  //     }
  //   }, {
  //     path: 'role',
  //     name: 'role',
  //     component: RoleManage,
  //     meta: { title: '角色管理' },
  //   }, {
  //     path: 'rolePermission/:id',
  //     name: 'role',
  //     hidden: true,
  //     component: RolePermission,
  //     meta: { title: '角色权限' },
  //   },
  //   {
  //     path: 'menu',
  //     name: 'menu',
  //     component: MenuManage,
  //     meta: { title: '菜单管理' }
  //   }
  //   ]
  // }, {
  //   path: '/course',
  //   name: 'course',
  //   component: Home,
  //   isHasChild: true,
  //   meta: {
  //     title: '课程管理',
  //   },
  //   children: [{
  //     path: 'list',
  //     name: 'courseList',
  //     component: CourseList,
  //     meta: {
  //       title: '课程列表'
  //     }
  //   }]
  // }, {
  //   path: '/dataAnalysis',
  //   name: 'dataAnalysis',
  //   component: Home,
  //   isHasChild: false,
  //   meta: {
  //     title: '数据分析'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       component: DataAnalysis
  //     }
  //   ]
  // },
]

// 动态路由
export const asyncRoutes = [{
  path: '/acl',
  name: 'acl',
  component: Home,
  isHasChild: true,
  meta: {
    title: '权限管理'
  },
  children: [{
    path: 'user',
    name: 'user',
    component: UserManage,
    meta: {
      title: '用户管理'
    }
  }, {
    path: 'role',
    name: 'role',
    component: RoleManage,
    meta: { title: '角色管理' },
  }, {
    path: 'rolePermission/:id',
    name: 'role',
    hidden: true,
    component: RolePermission,
    meta: { title: '角色权限' },
  },
  {
    path: 'menu',
    name: 'menu',
    component: MenuManage,
    meta: { title: '菜单管理' }
  }
  ]
}, {
  path: '/course',
  name: 'course',
  component: Home,
  isHasChild: true,
  meta: {
    title: '课程管理',
  },
  children: [{
    path: 'list',
    name: 'courseList',
    component: CourseList,
    meta: {
      title: '课程列表'
    }
  }, {
    path: 'category',
    name: 'courseCategory',
    component: CourseCategory,
    meta: {
      title: "课程分类"
    }
  }]
}, {
  path: '/dataAnalysis',
  name: 'dataAnalysis',
  component: Home,
  isHasChild: true,
  meta: {
    title: '数据分析'
  },
  children: [
    {
      path: 'list',
      name: 'dataList',
      component: DataAnalysis,
      meta: {
        title: '数据列表'
      }
    }
  ]
},]

const createRouter = () => new VueRouter({
  routes
})
const router = createRouter()
// 路由拦截
router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  console.log(store.state.asyncRoutesResult)
  // 判断用户是否登录
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
  const menuRoutes = JSON.parse(localStorage.getItem('menuRoutes'))
  if (loginInfo && loginInfo.token) {
    // 登录 -- 判断是否是刷新页面->vuex中无数据，则为刷新数据
    if (store.state.asyncRoutesResult.length === 0 && menuRoutes && menuRoutes.length !== 0) {
      // 重新获取动态路由
      resetRouter()
      store.dispatch("getRoutes").then((res) => {
        if (res) {
          next({ path: to.path })
        }
      });

    } else {
      // 必须有这一步，不然进入死循环
      next()
    }
  } else {
    // 未登录，跳转到登录页面
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})


// 重置路由
export const resetRouter = () => {
  router.matcher = createRouter().matcher
}

export default router