import "./index.css";
import { useEffect, useState } from "react";
import { Api, type Product, type User, type Category } from "@/api/Api.ts";

export const MyApi = new Api();

export function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [productNameField, setProductNameField] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    useEffect(() => {
        MyApi.getUsers.userGetUsers().then(r => {
            setUsers(r);
        });
    }, []);

    useEffect(() => {
        MyApi.getProducts.productGetProducts().then(r => {
            setProducts(r);
        });
    }, []);

    useEffect(() => {
        MyApi.getAll.categoryGetAll().then(r => {
            setCategories(r);
        });
    }, []);

    function handleCreateCategory() {
        MyApi.createCategory.categoryCreateCategory({ categoryName })
            .then(() => alert("Category created"));
    }

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
            <input
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                placeholder="New category name"
            />
            <button onClick={handleCreateCategory}>Create category</button>

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

            {users.map(user => (
                <div key={user.userId}>
                    {user.userName}
                </div>
            ))}

            {categories.map(category => (
                <div key={category.categoryId}>
                    {category.categoryName}
                </div>
            ))}
        </div>
    );
}

export default App;