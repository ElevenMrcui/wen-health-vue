import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    redirect: '/checkitem',
    component: () => import('../views/index.vue'),
    children: [
      {
        path: '/recovery',
        name: 'recovery',
        component: () => import('../views/appoment/recovery.vue')
      },
      {
        path: '/checkitem',
        name: 'checkitem',
        component: () => import('../views/appoment/checkitem.vue')
      },
      {
        path: '/checkgroup',
        name: 'checkgroup',
        component: () => import('../views/appoment/checkgroup.vue')
      },
     
      {
        path: '/ordersetting',
        name: 'ordersetting',
        component: () => import('../views/appoment/ordersetting.vue')
      },
      {
        path: '/setmeal',
        name: 'setmeal',
        component: () => import('../views/appoment/setmeal.vue')
      },
      {
        path: '/report_setmeal',
        name: 'report_setmeal',
        component: () => import('../views/report/report_setmeal.vue')
      },
      {
        path: '/report_member',
        name: 'report_member',
        component: () => import('../views/member/report_member.vue')
      },
      {
        path: '/report_business',
        name: 'report_business',
        component: () => import('../views/report/report_business.vue')
      },
      {
        path: '/error',
        name: 'error',
        component: () => import('../views/error/error.vue')
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
