import AdminPage from "../pages/AdminPage/AdminPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import HomePage from "../pages/HomePage/HomePage";
import MyOrderPage from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSucess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailsPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/ProductPage/ProductPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import LoginPage from "../pages/LoginPage/LoginPage"
import RegisterPage from "../pages/RegisterPage/RegisterPage"
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order/:id',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true
    },
    {
        path: '/orderSuccess',
        page: OrderSucess,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '/login',
        page: LoginPage,
        isShowHeader: false
    },
    {
        path: '/register',
        page: RegisterPage,
        isShowHeader: false
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivated: true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]