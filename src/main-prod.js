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
// import './plugins/element'
//引入axios
import axios from "axios";
//引入第三方树形table组件
import ZkTable from 'vue-table-with-tree-grid'

Vue.component(ZkTable.name, ZkTable)
//引入富文本编辑器Quill
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

//引入进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(VueRouter)

Vue.filter('dataFormater', function (time) {
    const dateFormater = new Date(time)
    const year = dateFormater.getFullYear()
    const month = (dateFormater.getMonth() + 1 + '').padStart(2, '0')
    const day = (dateFormater.getDay() + '').padStart(2, '0')
    const hour = (dateFormater.getHours() + '').padStart(2, '0')
    const min = (dateFormater.getMinutes() + '').padStart(2, '0')
    const sec = (dateFormater.getSeconds() + '').padStart(2, '0')
    return `${year}-${month}-${day} ${hour}-${min}-${sec}`
})

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
