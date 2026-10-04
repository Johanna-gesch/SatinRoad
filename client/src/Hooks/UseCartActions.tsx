import {useOutletContext} from "react-router-dom";
import type {CartItem, User} from "@/api/Api.ts";
import type {Dispatch, SetStateAction} from "react";
import {MyApi} from "@/Components/Products/ProductList.tsx";

export function useCartActions() {
    const { selectedUser, cart, setCart } = useOutletContext<{
        selectedUser: User | null;
        cart: CartItem[];
        setCart: Dispatch<SetStateAction<CartItem[]>>;
    }>();

    async function addToCart(product: any) {
        if (!selectedUser) {
            alert("Please log in");
            return;
        }

        await MyApi.addToCart.cartAddToCart({
            UserId: selectedUser.userId,
            ProductId: product.productId
        });

        setCart([
            ...cart,
            {
                cartItemId: crypto.randomUUID(),
                userId:selectedUser.userId,
                productId: product.productId,
                user: selectedUser,
                product: product
            }
        ]);
    }
    return { addToCart };
}