import { CategoryCreateForm } from "@/Components/Categories/CategoryCreateForm.tsx";
import {CategoryList } from "@/Components/Categories/CategoryList.tsx"
import {Api, type Category, type Product} from "@/api/Api.ts";
import {useEffect, useState} from "react";

export const MyApi = new Api({
    baseUrl: process.env.NODE_ENV === "production"
        ? "https://SATINROAD-API.fly.dev"
        : "http://localhost:5000"
});

export function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        MyApi.getAllCategories.categoryGetAllCategories().then(setCategories);
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