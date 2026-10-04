/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {App} from "./App";
import {AdminPage} from "@/Pages/AdminPage.tsx";
import {ProductDetailsPage} from "@/Pages/ProductDetailsPage.tsx";
import {SellerPage} from "@/Pages/SellerPage.tsx";
import {RootLayout} from "@/RootLayout.tsx";
import {MyProductsPage} from "@/Pages/MyProductsPage.tsx";
import {CartPage} from "@/Pages/cartPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <App />,
            },
            {
                path: "/admin",
                element: <AdminPage />,
            },

            {
                path: "/products/:productId",
                element: <ProductDetailsPage/>,
            },

            {
                path: "/users/:userId",
                element: <SellerPage/>,
            },
            {
                path: "users/:userId/products",
                element: <MyProductsPage />,
            },
            {
                path: "/cart",
                element: <CartPage />
            }
        ]
    },

]);

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
