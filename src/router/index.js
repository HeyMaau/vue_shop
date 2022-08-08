import VueRouter from 'vue-router'
import ShopLogin from "@/components/ShopLogin";
import ShopHome from "@/components/ShopHome";
import ShopWelcome from "@/components/ShopWelcome";
import ShopUsers from "@/components/user/ShopUsers";
import ShopRights from "@/components/power/ShopRights";
import ShopRoles from "@/components/power/ShopRoles";

const router = new VueRouter({
    routes: [
        {path: '/', redirect: '/login'},
        {
            path: '/login',
            component: ShopLogin
        },
        {
            path: '/home',
            component: ShopHome,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: ShopWelcome,
                },
                {
                    path: '/users',
                    component: ShopUsers
                },
                {
                    path: '/rights',
                    component: ShopRights
                },
                {
                    path: '/roles',
                    component: ShopRoles
                }
            ]
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