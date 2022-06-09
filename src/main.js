import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式表
import '@/assets/css/global.less'
import '../public/state/font/font_29dzbaml0wr/iconfont.css'
import '../public/state/theme/black'
import '../public/state/theme/white'

// 导入 echarts
import * as echarts from 'echarts'
import axios from 'axios'
import dayjs from 'dayjs'

import SocketServer from './utils/webSocket_server'
SocketServer.Instance.connect()
// 组件中使用回调函数方法
Vue.prototype.$socket = SocketServer.Instance

axios.defaults.baseURL = 'http://localhost:8888/api'
Vue.config.productionTip = false
// 挂载 echarts
Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios

Vue.filter('beijingTime', () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
