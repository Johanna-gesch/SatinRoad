import "./index.css";
import { Api} from "@/api/Api.ts";
import { CategoriesPage } from "@/Pages/CategoriesPage.tsx";
import { ProductsPage } from "@/Pages/ProductsPage.tsx";
import { UsersPage } from "@/Pages/UsersPage.tsx"

export function App() {

    return (
        <div>
            <h1>Categories</h1>
            <CategoriesPage />
            <h1>Users</h1>
            <UsersPage />
            <h1>Products</h1>
            <ProductsPage />
        </div>
    );
}

export default App;