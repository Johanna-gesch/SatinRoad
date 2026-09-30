import type {Product, User} from "@/api/Api";
import {ProductCreateForm} from "@/Components/Products/ProductCreateForm.tsx";
import {ProductList} from "@/Components/Products/ProductList.tsx";
import {useState} from "react";

type ProductsPageProps = {
    activeUser: User | null;
}

export function ProductsPage({activeUser}: ProductsPageProps) {
    const [products, setProducts] = useState<Product[]>([]);

    return ( 
        <div>
            <ProductCreateForm setProducts={setProducts} vendorUserId={activeUser?.userId ?? null} />
            <br></br>
            <ProductList products={products} setProducts={setProducts}/>
        </div>
    );
}