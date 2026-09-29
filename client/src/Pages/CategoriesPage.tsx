import { CategoryCreateForm } from "@/Components/Categories/CategoryCreateForm.tsx";
import {CategoryList } from "@/Components/Categories/CategoryList.tsx"

export function CategoriesPage() {
    return (
        <div>
            <CategoryCreateForm />
            <CategoryList />
        </div>
    )
}