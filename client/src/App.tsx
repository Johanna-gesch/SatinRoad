import "./index.css";
import { ProductsPage } from "@/Pages/ProductsPage.tsx";
import { LoginPage } from "@/Pages/LoginPage.tsx"
import {useNavigate, useOutletContext} from "react-router-dom";
import type {User, CartItem} from "@/api/Api.ts";
import {type Dispatch, type SetStateAction, useEffect} from "react";
import {MyApi} from "@/Components/Products/ProductList.tsx";


export function App() {

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
                    <button className={"loggedInUser"} onClick={() => navigate(`/users/${selectedUser.userId}/products`)}>{selectedUser.userName}</button>
                )}

                <h1>Satin Road</h1>
                <ProductsPage activeUser={selectedUser}/>

                {!selectedUser && ( // if there is no selectedUser - show loginPage
                    <LoginPage onLogin={setSelectedUser}/>
                )}
                {selectedUser && (
                    <button onClick={() => navigate(`/cart`)}>Cart ({cart.length})</button>
                )}
            </div>
        </>
    );
}

export default App;