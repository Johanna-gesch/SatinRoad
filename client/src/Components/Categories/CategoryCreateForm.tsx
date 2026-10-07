import {Api, type Category} from "@/api/Api.ts";
import {useState} from "react";

export const MyApi = new Api({
    baseUrl: process.env.NODE_ENV === "production"
        ? "https://SATINROAD-API.fly.dev"   // ret når backend er deployet
        : "http://localhost:5000"
});

interface CategoryCreateFormProps {
    setCategories: (value: Category[]) => void;
}

export function CategoryCreateForm({ setCategories }: CategoryCreateFormProps) {
    const [name, setName] = useState("");

    function handleCreate() {
        MyApi.createCategory.categoryCreateCategory({ categoryName: name })
            .then(() => {
                setName("");

                MyApi.getAllCategories.categoryGetAllCategories().then(setCategories);
            });
    }

    return (
        <div>
            Create Category:
            <input
                placeholder={"Category Name"}
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button onClick={handleCreate}>Create Category</button>
        </div>
    );
}
