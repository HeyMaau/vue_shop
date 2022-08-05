import Vue from 'vue'
import App from './App.vue'
//引入路由
import VueRouter from "vue-router";
import router from './router'
//引入全局样式
import './assets/css/global.css'
//引入图标库
import './assets/fonts/iconfont.css'
//引入element ui
import './plugins/element'
//引入axios
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(VueRouter)

/*Vue.use(Button)
Vue.use(Form)*/

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
