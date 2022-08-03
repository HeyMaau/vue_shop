import VueRouter from 'vue-router'
import ShopLogin from "@/components/ShopLogin";
import ShopHome from "@/components/ShopHome";

export default new VueRouter({
    routes: [
        {path: '/', redirect: '/login'},
        {
            path: '/login',
            component: ShopLogin
        },
        {
            path: '/home',
            component: ShopHome
        }
    ]
})