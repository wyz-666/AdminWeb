import { createWebHashHistory, createRouter } from 'vue-router';
import Login from "../views/Login";
import OrderList from "../views/quotation/OrderList";
import ChangePassword from "../views/user/ChangePassword";
import AddProduct from "../views/product/AddProduct";
import BrandManage from "../views/product/BrandManage";
import ProductList from "../views/product/ProductList";
import CategoryManage from "../views/product/CategoryManage";
import Home from "../views/Home";
import ResultPage from "../views/result/ResultPage";
import UserManage from "../views/user/UserManage";
import OrderDetail from "../views/quotation/OrderDetail";
import EditProduct from "../views/product/EditProduct";
import RefundProcess from "../views/quotation/RefundProcess";
import YearQuo from "../views/quotation/Year";
import CEAMonthQuo from "../views/quotation/CEAMonth";
import CCERMonthQuo from "../views/quotation/CCERMonth";
import SemiMonthQuo from "../views/quotation/SemiMonth";
import GECMonthQuo from "../views/quotation/GECMonth"
import UploadPrice from "../views/backtrack/UploadPrice";
import GetOrder from "../views/backtrack/GetOrder";
import HistoryExpectation from "../views/backtrack/HistoryExpectation"

const routes = [
    {
        path: '/',
        component: Login,
    },
    {   path: '/home',
        component: Home,
        redirect: '/user/manage',
        children: [
            {
                path: '/product/list',
                name: 'productList',
                component: ProductList,
            },
            {
                path: '/product/add',
                name: 'addProduct',
                component: AddProduct,
            },
            {
                path: '/product/edit',
                name: 'editProduct',
                component: EditProduct,
            },
            {
                path: '/product/category',
                name: 'productCategory',
                component: CategoryManage,
            },
            {
                path: '/product/brand',
                name: 'productBrand',
                component: BrandManage,
            },
            {
                path: '/quotation/list',
                name: 'orderList',
                component: OrderList,
            },
            {
                path: '/quotation/refund',
                name: 'orderRefund',
                component: RefundProcess,
            },
            {
                path: '/quotation/detail',
                name: 'orderDetail',
                component: OrderDetail,
            },
            {
                path: '/quotation/year',
                name: 'yearQuotation',
                component: YearQuo,
            },
            {
                path: '/quotation/ceamonth',
                name: 'ceaMonthQuotation',
                component: CEAMonthQuo,
            },
            {
                path: '/quotation/gecmonth',
                name: 'gecMonthQuotation',
                component: GECMonthQuo,
            },
            {
                path: '/quotation/ccermonth',
                name: 'ccerMonthQuotation',
                component: CCERMonthQuo,
            },
            {
                path: '/quotation/semimonth',
                name: 'semimonthQuotation',
                component: SemiMonthQuo,
            },
            {
                path: '/backtrack/getOrder',
                name: 'getOrder',
                component: GetOrder,
            },
            {
                path: '/backtrack/uploadPrice',
                name: 'uploadPrice',
                component: UploadPrice,
            },
            {
                path: '/backtrack/historyExpectation',
                name: 'historyExpectation',
                component: HistoryExpectation,
            },
            {
                path: '/user/manage',
                name: 'userManage',
                component: UserManage,
            },
            {
                path: '/change/password',
                name: 'changePassword',
                component: ChangePassword,
            },
            {
                path: '/result/page',
                name: 'resultPage',
                component: ResultPage
            }
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(), routes
})

export default router;