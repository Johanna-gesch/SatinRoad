import {Api, type Category} from "@/api/Api.ts";
import {useState} from "react";

export const MyApi = new Api();

interface CategoryCreateFormProps {
    setCategories: (value: Category[]) => void;
}

export function CategoryCreateForm({ setCategories }: CategoryCreateFormProps) {
    const [name, setName] = useState("");

    function handleCreate() {
        MyApi.createCategory.categoryCreateCategory({ categoryName: name })
            .then(() => {
                setName("");

                MyApi.getAll.categoryGetAll().then(setCategories);
            });
    }

    return (
        <div>
            <input value={name} onChange={e => setName(e.target.value)} />
            <button onClick={handleCreate}>Create Category</button>
        </div>
    );
}
