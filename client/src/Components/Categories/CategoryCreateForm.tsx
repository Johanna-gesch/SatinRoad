import {Api, type Product, type Category} from "@/api/Api.ts";
import {useEffect, useState} from "react";

export const MyApi = new Api();

export function CategoryCreateForm() {
    const [name, setName] = useState("");

    function handleCreate() {
        MyApi.createCategory.categoryCreateCategory({ categoryName: name })
            .then(() => setName(""));
    }

    return (
        <div>
            <input value={name} onChange={e => setName(e.target.value)} />
            <button onClick={handleCreate}>Create Category</button>
        </div>
    );
}
