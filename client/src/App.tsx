import "./index.css";
import { CategoriesPage } from "@/Pages/CategoriesPage.tsx";
import { ProductsPage } from "@/Pages/ProductsPage.tsx";
import { LoginPage } from "@/Pages/LoginPage.tsx"
import { AdminPage } from "@/Pages/AdminPage.tsx"
import {useState} from "react";
import type {User} from "@/api/Api.ts";
import { useNavigate } from "react-router-dom";


export function App() {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
                    <p className={"loggedInUser"}>{selectedUser.userName}</p>
                )}
                <h1>Categories</h1>
                <CategoriesPage/>

                <h1>Products</h1>
                <ProductsPage/>

                {!selectedUser && ( // if there is no selectedUser - show loginPage
                    <LoginPage onLogin={setSelectedUser}/>
                )}
            </div>
        </>
    );
}

export default App;