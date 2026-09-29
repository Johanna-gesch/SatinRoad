import {useEffect, useState} from "react";
import {Api, type Category} from "@/api/Api.ts";

export const MyApi = new Api();

export function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    useEffect(() => {
        MyApi.getAll.categoryGetAll().then(setCategories);
    }, []);

    function startEditing(category: Category) {
        setEditingId(category.categoryId);
        setEditingName(category.categoryName);
    }

    function save() {
        MyApi.updateCategory.categoryUpdateCategory({
            categoryIdForLookup: editingId!,
            newCategoryName: editingName
        }).then(() => {
            setEditingId(null);
            MyApi.getAll.categoryGetAll().then(setCategories);
        })
    }

    return (
        <div className={"categories"}>
            {/*Map all categories*/}
            {categories.map(c => (
                <div key={c.categoryId}>
                    {/* If this category is currently being edited, show input and save button */}
                    {editingId === c.categoryId ? (
                        <>
                            <input
                                value={editingName}
                                onChange={e => setEditingName(e.target.value)}
                            />
                            <button onClick={save}>Save</button>
                        </>
                    ) : (
                        <>
                            {/* Normal view mode. Shows the category name */}
                            {c.categoryName}
                            <button onClick={() => startEditing(c)}>Edit</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
