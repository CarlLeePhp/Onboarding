import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import CustomerList from './components/Customer/CustomerList';
import StoreList from './components/Store/StoreList';
import ProductList from './components/Product/ProductList';

const AppRoutes = [
    {
    index: true,
    element: <Home />
    },
    {
    path: '/counter',
    element: <Counter />
    },
    {
    path: '/fetch-data',
    element: <FetchData />
    },
    {
        path: '/customer',
        element: <CustomerList />
    },
    {
        path: '/store',
        element: <StoreList />
    },
    {
        path: '/product',
        element: <ProductList />
    },
    {
        path: '/sale',
        element: <StoreList />
    }
];

export default AppRoutes;
