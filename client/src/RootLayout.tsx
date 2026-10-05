import {useState} from "react";
import type {CartItem, Product, User} from "@/api/Api.ts";
import {Outlet} from "react-router-dom";

export function RootLayout() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    return (
        <div>
            <Outlet context={{
                selectedUser,
                setSelectedUser,
                cart,
                setCart,
                products,
                setProducts
            }} />
        </div>
    );
}