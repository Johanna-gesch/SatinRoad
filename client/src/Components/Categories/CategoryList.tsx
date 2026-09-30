import {useEffect, useState} from "react";
import {Api, type Category, type Product} from "@/api/Api.ts";

export const MyApi = new Api();

interface CategoryListProps {
    categories: Category[];
    setCategories: (value: Category[]) => void;
    setProducts: (value: Product[]) => void;
}

export function CategoryList({ categories, setCategories, setProducts }: CategoryListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

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

    function deleteCategory(id: string) {
        MyApi.deleteCategory.categoryDeleteCategory({ CategoryId: id })
            .then(() =>{
                MyApi.getAll.categoryGetAll().then(setCategories);
                MyApi.getProducts.productGetProducts().then(setProducts);
            });
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
                            
                            <button onClick={() => deleteCategory(c.categoryId)}>Delete</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
