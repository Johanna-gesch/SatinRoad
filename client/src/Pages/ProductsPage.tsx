import {Api, type Category, type Product, type User} from "@/api/Api";
import {ProductCreateForm} from "@/Components/Products/ProductCreateForm.tsx";
import {ProductList} from "@/Components/Products/ProductList.tsx";
import {useEffect, useState} from "react";
import {CategoryList} from "@/Components/Categories/CategoryList.tsx";
import {CategorySidebar} from "@/Components/Categories/CategorySidebar.tsx";

type ProductsPageProps = {
    activeUser: User | null;
}

export const MyApi = new Api();

export function ProductsPage({activeUser}: ProductsPageProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        MyApi.getAllCategories.categoryGetAllCategories()
            .then(setCategories);
    }, []);

    return ( 
        <div>
            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <ProductList
                products={products}
                setProducts={setProducts}
                activeUser={activeUser}
                selectedCategory={selectedCategory}
            />
        </div>
    );
}