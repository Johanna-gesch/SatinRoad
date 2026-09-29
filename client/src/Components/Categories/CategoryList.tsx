import {useEffect, useState} from "react";
import {Api, type Product, type Category} from "@/api/Api.ts";

export const MyApi = new Api();

export function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        MyApi.getAll.categoryGetAll().then(setCategories);
    }, []);

    return (
        <div className={"categories"}>
            {categories.map(c => (
                <div key={c.categoryId}>{c.categoryName}</div>
            ))}
        </div>
    );
}
