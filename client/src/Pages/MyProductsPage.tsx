import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { User, Product } from "@/api/Api.ts";
import { MyApi } from "@/Components/Products/ProductList.tsx";
import {ProductCreateForm} from "@/Components/Products/ProductCreateForm.tsx";

export function MyProductsPage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [showBoughtProducts, setShowBoughtProducts] = useState(false)

    useEffect(() => {
        if (!userId) return;

        MyApi.getUserWithProducts.userGetUserWithProducts({
            id: userId
        }).then(setUser);
    }, [userId]);

    if (!user) {
        return <p>Loading...</p>;
    }

    function handleEditOrSaveProduct(product: Product) {
        if (editingProductId === product.productId) {
            MyApi.updateProduct.productUpdateProduct({
                productId: product.productId,
                productName: product.productName,
                price: product.price,
                description: product.description,
                categoryIds: product.categories?.map(category => category.categoryId)
            })
                .then(() => {
                    setEditingProductId(null);
                });
        } else {
            setEditingProductId(product.productId);
        }
    }

    function handleDelete(product: Product) {
        MyApi.deleteProduct.productDeleteProduct({
            id: product.productId
        }).then(() => {
            // Update the user state after deleting the product
            setUser(currentUser => {
                if (!currentUser) return currentUser;

                return {
                    // Keep all the existing user information
                    ...currentUser,
                    // Create a new product list without the deleted product
                    products: currentUser.products.filter(
                        p => p.productId !== product.productId
                    )
                };
            });
        });
    }

    function reloadUser() {
        if (!userId) return;

        // Fetch the user again so the new product appears in the list
        MyApi.getUserWithProducts.userGetUserWithProducts({
            id: userId
        }).then(setUser);
    }

    const displayedProducts = user.products.filter(product => showBoughtProducts
        ? product.quantityAvailable === 0
        : product.quantityAvailable !== 0)

    return (
        <div>
            <button
                onClick={() => navigate("/")}
                style={{ marginBottom: "20px" }}
            >
                Back to products
            </button>
            <ProductCreateForm vendorUserId={user.userId} onProductCreated={reloadUser} />
            <h1>My Products</h1>

            <div>
                <button
                    onClick={() => setShowBoughtProducts(false)}
                    disabled={!showBoughtProducts}
                >Active Products</button>
                <button onClick={() => setShowBoughtProducts(true)}
                disabled={showBoughtProducts}
                >Bought Products</button>
            </div>

            <p>Products belonging to {user.userName}</p>

            <div className="products">
                {displayedProducts.map(product => (
                    <div
                        key={product.productId}
                        className="productCard"
                    >
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.productName}
                                className="productImage"
                            />
                        )}

                        {editingProductId === product.productId ? (
                            <input
                                value={product.productName}
                                onChange={e => {
                                    // Update the product name in local state while typing
                                    setUser(currentUser => {
                                        if (!currentUser) return currentUser;

                                        return {
                                            // Keep all the existing user information
                                            ...currentUser,
                                            // Create a new product list with the products new name
                                            products: currentUser.products.map(p =>
                                                p.productId === product.productId
                                                    ? {
                                                        ...p,
                                                        productName: e.target.value
                                                    }
                                                    : p
                                            )
                                        };
                                    });
                                }}
                            />
                        ) : (
                            <button
                                className="productNameBtn"
                                onClick={() =>
                                    navigate(`/products/${product.productId}`)
                                }
                            >
                                {product.productName}
                            </button>
                        )}

                        <p className="productPrice">
                            {product.price} kr.
                        </p>

                        <p className="productTimestamp">
                            Created:{" "}
                            {new Date(product.createdAt).toLocaleDateString()}
                        </p>

                        {product.quantitySold > 0 && product.lastBoughtAt && (
                            <p className="productBoughtAt">
                                Bought:{" "}
                                {new Date(product.lastBoughtAt).toLocaleDateString()}
                            </p>
                        )}

                        <br />

                        <div className="productBtns">
                            <button
                                onClick={() =>
                                    handleEditOrSaveProduct(product)
                                }
                            >
                                {editingProductId === product.productId
                                    ? "Save"
                                    : "Edit"}
                            </button>

                            <button
                                onClick={() => handleDelete(product)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}