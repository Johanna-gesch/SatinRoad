import type { Product } from "@/api/Api";
import {ProductCreateForm} from "@/Components/Products/ProductCreateForm.tsx";
import {ProductList} from "@/Components/Products/ProductList.tsx";
import {useState} from "react";

export function ProductsPage() {

    const [products, setProducts] = useState<Product[]>([]);

    return ( 
        <div>
            <ProductCreateForm setProducts={setProducts} />
            <br></br>
            <ProductList products={products} setProducts={setProducts}/>
        </div>
    );
}