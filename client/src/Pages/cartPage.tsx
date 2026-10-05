import {useNavigate, useOutletContext} from "react-router-dom";
import type {CartItem, User} from "@/api/Api.ts";
import {CartItemView} from "@/Pages/CartItemView.tsx";

export function CartPage() {
    const { cart, selectedUser } = useOutletContext<{
        cart: CartItem[];
        selectedUser: User | null;
    }>()
    const navigate = useNavigate(); // used for switching page


    if (!selectedUser) return <p>Please log in</p>;

    return (
        <div>
            <button
                onClick={() => navigate("/")}
                style={{marginBottom: "20px"}}
            >
                Back to products
            </button>
            <h2>Your cart</h2>
            {cart.length === 0 && <p>Your cart is empty</p>}

            {cart.map(item => (
                <CartItemView key={item.cartItemId} item={item} />
            ))}
        </div>
    )
}