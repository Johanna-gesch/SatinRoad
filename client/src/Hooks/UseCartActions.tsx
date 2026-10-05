import {useOutletContext} from "react-router-dom";
import type {CartItem, Product, User} from "@/api/Api.ts";
import type {Dispatch, SetStateAction} from "react";
import {MyApi} from "@/Components/Products/ProductList.tsx";

export function useCartActions() {
    const {selectedUser, cart, setCart} = useOutletContext<{
        selectedUser: User | null;
        cart: CartItem[];
        setCart: Dispatch<SetStateAction<CartItem[]>>;
    }>();

    async function addToCart(product: Product, qty: number) {
        if (!selectedUser) {
            alert("Please log in");
            return;
        }

        if (qty > product.quantityAvailable) {
            alert("Not enough stock");
            return;
        }

        await MyApi.addToCart.cartAddToCart({
            UserId: selectedUser.userId,
            ProductId: product.productId,

        });

        await MyApi.updateQuantity.cartUpdateQuantity({
            UserId: selectedUser.userId,
            ProductId: product.productId,
            Quantity: qty
        });

        const updatedCart = await MyApi.getCart.cartGetCart({
            userId: selectedUser.userId
        });

        setCart(updatedCart);
    }

    return {addToCart};
}