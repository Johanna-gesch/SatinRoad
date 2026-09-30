import { CategoryCreateForm } from "@/Components/Categories/CategoryCreateForm.tsx";
import {CategoryList } from "@/Components/Categories/CategoryList.tsx"
import {Api} from "@/api/Api.ts";
import {useEffect, useState} from "react";

export const MyApi = new Api();

export function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        MyApi.getAll.categoryGetAll().then(setCategories);
    }, []);
    return (
        <div>
            <CategoryCreateForm />
            <CategoryList />
        </div>
    )
}