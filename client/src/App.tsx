import "./index.css";
import { ProductsPage } from "@/Pages/ProductsPage.tsx";
import { LoginPage } from "@/Pages/LoginPage.tsx"
import {useNavigate, useOutletContext} from "react-router-dom";
import type {User} from "@/api/Api.ts";
import type {Dispatch, SetStateAction} from "react";


export function App() {

    const { selectedUser, setSelectedUser } = useOutletContext<{
        selectedUser: User | null;
        setSelectedUser: Dispatch<SetStateAction<User | null>>;
    }>();

    const navigate = useNavigate();

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
            </div>
        </>
    );
}

export default App;