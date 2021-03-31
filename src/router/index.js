import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/ObjSection',
    component: Layout,
    redirect: '/ObjSection',
    name: 'ObjSection',
    meta: { title: '客观数据分析', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'objfile',
        name: 'objfile',
        component: () => import('@/views/ObjSection/objfile'),
        meta: { title: '文件上传', icon: 'table' }
      },
      {
        path: 'objdisper',
        name: 'objdisper',
        component: () => import('@/views/ObjSection/objdisper'),
        meta: { title: '评价离散分析', icon: 'tree' }
      },
      {
        path: 'objaver',
        name: 'objaver',
        component: () => import('@/views/ObjSection/objaver'),
        meta: { title: '指标均值分析', icon: 'form' }
      },
      {
        path: 'objentro',
        name: 'objentro',
        component: () => import('@/views/ObjSection/objentro'),
        meta: { title: '指标确定量分析', icon: 'link' }
      },
      {
        path: 'objleida',
        name: 'objleida',
        component: () => import('@/views/ObjSection/objleida'),
        meta: { title: '综合指标分析', icon: 'leida' }
      },
    ]
  },

  {
    path: '/SubSection',
    component: Layout,
    redirect:'subfile',
    meta: { title: '主观数据分析', icon: 'zhuguan' },
    children: [
      {
        path: 'subfile',
        name: 'subfile',
        component: () => import('@/views/SubSection/subfile'),
        meta: { title: '文件上传', icon: 'table' }
      },
      {
        path: 'subclass',
        name: 'subclass',
        component: () => import('@/views/SubSection/subclass'),
        meta: { title: '评价分类', icon: 'nested' }
      },
      {
        path: 'subemos',
        name: 'subemos',
        component: () => import('@/views/SubSection/subemos'),
        meta: { title: '评价情感分析', icon: 'emos' }
      },
      {
        path: 'subfocus',
        name: 'subfocus',
        component: () => import('@/views/SubSection/subfocus'),
        meta: { title: '评价特性分析', icon: 'texing' }
      },
      {
        path: 'subinfo',
        name: 'subinfo',
        component: () => import('@/views/SubSection/subinfo'),
        meta: { title: '评价观点抽取', icon: 'ideas' }
      },
    ]
  },

  {
    path: '/Record',
    component: Layout,
    children: [
      {
        path: 'record',
        component:()=> import('@/views/Record/record'),
        meta: { title: '记录', icon: 'form' }
      }
    ]
  },
  {
    path:'/Person',
    component:Layout,
    children:[
      {
        path: '/person',
        component:() => import ('@/views/Person/person'),
        meta:{title:'个人中心' ,icon:'form'},
        hidden:true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
