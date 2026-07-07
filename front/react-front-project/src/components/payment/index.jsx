import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CheckoutPage } from './checkout.jsx';
import { SuccessPage } from './success.jsx';
import { FailPage } from './fail.jsx';
import './style.css';

const router = createBrowserRouter([
    {
        path: "/sandbox",
        element: <CheckoutPage />,
    },
    {
        path: "/sandbox/success",
        element: <SuccessPage />,
    },
    {
        path: "/sandbox/fail",
        element: <FailPage />,
    },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);