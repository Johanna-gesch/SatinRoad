import {CategoriesPage} from "@/Pages/CategoriesPage.tsx";
import {UsersPage} from "@/Pages/UsersPage.tsx";
import {useNavigate} from "react-router-dom";

export function AdminPage() {

    const navigate = useNavigate(); // used for switching page


    return (
        <>
            <div className={"AdminContainer"}>
                <div>
                    <h1>Categories</h1>
                    <CategoriesPage/>
                </div>
                <div>
                    <h1>Users</h1>
                    <UsersPage/>
                </div>
            </div>
            <button onClick={() => navigate("/")}>
                Back to products
            </button>
        </>
    );
}