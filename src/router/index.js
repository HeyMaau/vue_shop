import VueRouter from 'vue-router'

const ShopLogin = () => import(/* webpackChunkName: "index" */ '@/components/ShopLogin')
const ShopHome = () => import(/* webpackChunkName: "index" */ '@/components/ShopHome')
const ShopWelcome = () => import(/* webpackChunkName: "index" */ '@/components/ShopWelcome')

const ShopUsers = () => import(/* webpackChunkName: "user" */ '@/components/user/ShopUsers')

const ShopRights = () => import(/* webpackChunkName: "power" */ '@/components/power/ShopRights')
const ShopRoles = () => import(/* webpackChunkName: "power" */ '@/components/power/ShopRoles')

const ShopCategory = () => import(/* webpackChunkName: "power" */ '@/components/goods/ShopCategory')
const ShopCategoryParams = () => import(/* webpackChunkName: "power" */ '@/components/goods/ShopCategoryParams')
const ShopGoodsList = () => import(/* webpackChunkName: "power" */ '@/components/goods/ShopGoodsList')
const ShopGoodsAdd = () => import(/* webpackChunkName: "power" */ '@/components/goods/ShopGoodsAdd')

const ShopOrder = () => import(/* webpackChunkName: "order" */ '@/components/order/ShopOrder')

const ShopReport = () => import(/* webpackChunkName: "report" */ '@/components/report/ShopReport')

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