import "./index.css";
import { CategoriesPage } from "@/Pages/CategoriesPage.tsx";
import { ProductsPage } from "@/Pages/ProductsPage.tsx";
import { LoginPage } from "@/Pages/LoginPage.tsx"
import {useState} from "react";


export function App() {

    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    return (
        <div>
            {selectedUser && (
                <p className={"loggedInUser"}>{selectedUser}</p>
            )}
            <h1>Categories</h1>
            <CategoriesPage />

            <h1>Products</h1>
            <ProductsPage />

            {!selectedUser && ( // if there is no selectedUser - show loginPage
                <LoginPage onLogin={setSelectedUser} />
            )}
        </div>
    );
}

export default App;