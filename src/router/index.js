import VueRouter from 'vue-router'
import ShopLogin from "@/components/ShopLogin";
import ShopHome from "@/components/ShopHome";
import ShopWelcome from "@/components/ShopWelcome";
import ShopUsers from "@/components/user/ShopUsers";
import ShopRights from "@/components/power/ShopRights";
import ShopRoles from "@/components/power/ShopRoles";
import ShopCategory from "@/components/goods/ShopCategory";
import ShopCategoryParams from "@/components/goods/ShopCategoryParams";
import ShopGoodsList from "@/components/goods/ShopGoodsList";
import ShopGoodsAdd from "@/components/goods/ShopGoodsAdd";
import ShopOrder from "@/components/order/ShopOrder";
import ShopReport from "@/components/report/ShopReport";

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
                },
                {
                    path: '/categories',
                    component: ShopCategory
                },
                {
                    path: '/params',
                    component: ShopCategoryParams
                },
                {
                    path: '/goods',
                    component: ShopGoodsList
                },
                {
                    path: '/goods/add',
                    component: ShopGoodsAdd
                },
                {
                    path: '/orders',
                    component: ShopOrder
                },
                {
                    path: '/reports',
                    component: ShopReport
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