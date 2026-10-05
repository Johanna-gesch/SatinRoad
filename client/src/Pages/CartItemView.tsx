import type {CartItem} from "@/api/Api.ts";
import {useOutletContext} from "react-router-dom";
import type {Dispatch, SetStateAction} from "react";
import {MyApi} from "@/Components/Products/ProductList.tsx";

export function CartItemView({ item }: { item: CartItem }){
    const { cart, setCart } = useOutletContext<{
        cart: CartItem[];
        setCart: Dispatch<SetStateAction<CartItem[]>>;
    }>();

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
            <h4>Price: {item.product.price} kr</h4>

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