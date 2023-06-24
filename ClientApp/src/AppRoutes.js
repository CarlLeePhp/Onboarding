import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import CustomerList from './components/Customer/CustomerList';

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
    }
];

export default AppRoutes;
