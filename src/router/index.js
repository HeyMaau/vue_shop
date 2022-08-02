import VueRouter from 'vue-router'
import ShopLogin from "@/components/ShopLogin";

export default new VueRouter({
    routes: [
        {path: '/', redirect: '/login'},
        {
            path: '/login',
            component: ShopLogin
        }
    ]
})