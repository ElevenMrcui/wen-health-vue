import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import axios from 'axios'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.prototype.$http = axios
//  定义异步请求 拦截器 所有的axios请求 发送之前 都会携带 headers.authentication  token数据
// axios.interceptors.request.use(config => {
//   console.log(config)
//   config.headers.authentication = window.sessionStorage.getItem("token")
//   return config;
// }, 
// function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// }

// )


// http response 拦截器
// axios.interceptors.response.use(
//   response => {
//      //  对响应数据 处理
//       return response;
//   },
//   error => {
//     if (error.response) {
//       switch (error.response.status) {
//           case 403:
//               // 返回 403 转到登录页面
//                //跳转到主页
//                window.sessionStorage.removeItem("token")
//                router.replace({ name: "login" });
//       }
//   }
       
//       return Promise.reject(error.response.data)   // 返回接口返回的错误信息
//   });

  //  定义路由拦截
  // 语法 ：router.beforeEach（）一般用来做一些进入页面的限制。比如没有登录，就不能进入某些页面，
  // 只有登录了之后才有权限查看某些页面。  to 表示需要访问的目标router  next 表示可以访问

  // router.beforeEach((to,from,next)=>{
  //   if(to.name != 'login'){
  //     if(window.sessionStorage.getItem("token")){
  //       next()
  //     }else{
  //       next({path:'/'})
  //     }
  //   }else{
  //     next()
  //   } 
  // })



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
