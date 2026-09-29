import "./index.css";
import { useEffect, useState } from "react";
import { Api, type Product, type User, type Category } from "@/api/Api.ts";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { UsersPage } from "@/Pages/UsersPage.tsx"

export const MyApi = new Api();

export function App() {
    const [products, setProducts] = useState<Product[]>([]);

    const [productNameField, setProductNameField] = useState("");
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    
    useEffect(() => {
        MyApi.getProducts.productGetProducts().then(r => {
            setProducts(r);
        });
    }, []);
    
    function handleCreateProduct() {
        MyApi.createProduct.productCreateProduct({ ProductName: productNameField })
            .then(() => setProductNameField(""))
            .then(() => {
                MyApi.getProducts.productGetProducts().then(r => {
                    setProducts(r);
                });
            });
    }

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
            <CategoriesPage />
            <UsersPage />
            Create Product:
            <input
                placeholder={"Product Name"}
                value={productNameField}
                onChange={e => setProductNameField(e.target.value)}
            ></input>
            <button onClick={handleCreateProduct}>Create</button>

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

export default App;