import {Api, type Product} from "@/api/Api.ts";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";

export const MyApi = new Api();

type ProductListProps = {
    products: Product[];
    setProducts: Dispatch<SetStateAction<Product[]>>;
};

export function ProductList({products, setProducts}: ProductListProps) {
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    useEffect(() => {
        MyApi.getProducts.productGetProducts().then(r => {
            setProducts(r);
        });
    }, []);

    function handleEditOrSaveProduct(product: Product) {
        if (editingProductId === product.productId) {
            MyApi.updateProduct.productUpdateProduct({
                ProductId: product.productId,
                ProductName: product.productName,
            })
                .then(() => setEditingProductId(null))
                .then(() => {
                    MyApi.getProducts.productGetProducts().then(r => {
                        setProducts(r);
                    });
                });
        } else {
            setEditingProductId(product.productId);
        }
    }

    return (
        <div>
            {products.map(product => (
                <div key={product.productId}>
                    {editingProductId === product.productId ? (
                        <input
                            value={product.productName}
                            onChange={e => {
                                setProducts(products.map(p =>
                                    p.productId === product.productId
                                        ? { ...p, productName: e.target.value }
                                        : p
                                ));
                            }}
                        />
                    ) : (
                        <>{product.productName}</>
                    )}
                    <button onClick={() => handleEditOrSaveProduct(product)}>
                        {editingProductId === product.productId ? "Save" : "Edit"}
                    </button>
                </div>
            ))}
        </div>
    );
}

