import {useState} from "react";
import type {CartItem, User} from "@/api/Api.ts";
import {Outlet} from "react-router-dom";

export function RootLayout() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    return (
        <div>
            <Outlet context={{
                selectedUser,
                setSelectedUser,
                cart,
                setCart
            }} />
        </div>
    );
}