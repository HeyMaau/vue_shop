import VueRouter from 'vue-router'
import ShopLogin from "@/components/ShopLogin";
import ShopHome from "@/components/ShopHome";

const router = new VueRouter({
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

router.beforeEach((to, from, next) => {
    if (to.path === "/login") {
        next();
    } else {
        const token = sessionStorage.getItem("token")
        if (!token) {
            next("/login")
        } else {
            next()
        }
    }
})

export default router