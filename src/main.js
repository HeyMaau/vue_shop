import Vue from 'vue'
import App from './App.vue'
//引入路由
import VueRouter from "vue-router";
import router from './router'
//引入全局样式
import './assets/css/global.css'
//引入element ui组件库
import {Button, Form, Input, FormItem} from "element-ui";
//引入图标库
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

Vue.use(VueRouter)

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(Input.name, Input)
Vue.component(FormItem.name, FormItem)

/*Vue.use(Button)
Vue.use(Form)*/

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
