import "./index.css";
import { ProductsPage } from "@/Pages/ProductsPage.tsx";
import { LoginPage } from "@/Pages/LoginPage.tsx"
import {useNavigate, useOutletContext} from "react-router-dom";
import type {User, CartItem} from "@/api/Api.ts";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {MyApi} from "@/Components/Products/ProductList.tsx";


export function App() {

    const [topsellers, setTopsellers] = useState<string[]>([]);

    const { selectedUser, setSelectedUser, cart, setCart } = useOutletContext<{
        selectedUser: User | null;
        setSelectedUser: Dispatch<SetStateAction<User | null>>;
        cart: CartItem[];
        setCart: Dispatch<SetStateAction<CartItem[]>>;
    }>();

    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedUser) return;

        MyApi.getCart.cartGetCart({ userId: selectedUser.userId })
            .then(setCart);
    }, [selectedUser]);

    useEffect(() => {
        MyApi.getTopsellers.userGetTopsellers()
            .then(r => {
                setTopsellers(r.topSellerNames)
            })
    }, []);

    return (
        <>
            <div>
                {selectedUser?.isAdmin && (
                    <button
                        className={"adminBtn"}
                        onClick={() => navigate("/admin")}>
                        Admin
                    </button>
                )}
                {selectedUser && (
                    <button className="cartFloating" onClick={() => navigate(`/cart`)}>Cart 🛒({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
                )}
                {selectedUser && (
                    <button className={"loggedInUser"} onClick={() => navigate(`/users/${selectedUser.userId}/products`)}>{selectedUser.userName}</button>
                )}

                <h1>Satin Road</h1>

                {topsellers.length > 0 && (
                    <div>
                        <h3>Top Sellers:</h3>

                        {topsellers.map(name => (
                            <p key={name}>{name}</p>
                        ))}
                    </div>
                )}

                <ProductsPage activeUser={selectedUser}/>

                {!selectedUser && ( // if there is no selectedUser - show loginPage
                    <LoginPage onLogin={setSelectedUser}/>
                )}
            </div>
        </>
    );
}

export default App;