import { CategoryCreateForm } from "@/Components/Categories/CategoryCreateForm.tsx";
import {CategoryList } from "@/Components/Categories/CategoryList.tsx"
import {Api, type Category, type Product} from "@/api/Api.ts";
import {useEffect, useState} from "react";

export const MyApi = new Api();

export function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        MyApi.getAll.categoryGetAll().then(setCategories);
        MyApi.getProducts.productGetProducts().then(setProducts);
    }, []);
    return (
        <div>
            <CategoryCreateForm setCategories={setCategories} />
            <CategoryList categories={categories}
                          setCategories={setCategories}
                          setProducts={setProducts}
            />
        </div>
    )
}