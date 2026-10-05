import type {CartItem} from "@/api/Api.ts";
import {useOutletContext} from "react-router-dom";
import {type Dispatch, type SetStateAction, useState} from "react";
import {MyApi} from "@/Components/Products/ProductList.tsx";

export function CartItemView({ item }: { item: CartItem }){
    const { cart, setCart } = useOutletContext<{
        cart: CartItem[];
        setCart: Dispatch<SetStateAction<CartItem[]>>;
    }>();

    async function updateQty(newQty: number){
        await MyApi.updateQuantity.cartUpdateQuantity({
            UserId: item.userId,
            ProductId: item.productId,
            Quantity: newQty
        })
        //Update cart state locally
        setCart(cart.map(ci =>
            ci.cartItemId === item.cartItemId
                ? { ...ci, quantity: newQty }
                : ci
        ));
    }

    async function removeItem() {
        await MyApi.removeFromCart.cartRemoveFromCart({
            UserId: item.userId,
            ProductId: item.productId
        });

        setCart(cart.filter(ci => ci.cartItemId !== item.cartItemId));
    }

    return (
        <div className="cart-item">
            <h3>{item.product.productName}</h3>
            <h3>Price: {item.product.price} kr</h3>

            <div className="qtySelector">
                <button
                    disabled={item.quantity <= 1}
                    onClick={() => updateQty(item.quantity - 1)}
                >
                    -
                </button>

                <span>{item.quantity}</span>

                <button
                    disabled={item.quantity >= item.product.quantityAvailable}
                    onClick={() => updateQty(item.quantity + 1)}
                >
                    +
                </button>
            </div>
            <p>Quantity: {item.quantity}</p>
            <p>Total: {item.product.price * item.quantity} kr</p>

            {item.product.imageUrl && (
                <img
                    src={item.product.imageUrl}
                    alt={item.product.productName}
                    className="cartItemImage"
                />
            )}

            <button className="removeBtn" onClick={removeItem}>
                Remove from cart
            </button>
        </div>
    )
}