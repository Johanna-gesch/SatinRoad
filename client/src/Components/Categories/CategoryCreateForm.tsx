import {Api} from "@/api/Api.ts";
import {useState} from "react";

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
