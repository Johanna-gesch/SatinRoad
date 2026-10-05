import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import type {CartItem, Product, User} from "@/api/Api.ts";
import {MyApi} from "@/Components/Products/ProductList.tsx";
import {useCartActions} from "@/Hooks/UseCartActions.tsx";

/**
 * ProductDetailsPage
 * The page for a single product
 * It reads the product id from the URL, fetches that product from the
 * backend and shows its name and category.
 * "View seller" opens the seller's page
 * @constructor
 */

export function ProductDetailsPage() {
    const {productId} = useParams(); // id from URL
    const navigate = useNavigate(); // used for switching page
    const [product, setProduct] = useState<Product | null>(null);
    const {selectedUser, cart, setCart} = useOutletContext<{
        selectedUser: User | null;
        cart: CartItem[];
        setCart: Dispatch<SetStateAction<CartItem[]>>
    }>();
    const { addToCart } = useCartActions();
    const [qty, setQty] = useState(1);

    // Fetch the product whenever the id in the URL changes
    useEffect(() => {
        if (!productId) return;

        MyApi.getProductById.productGetProductById({
            id: productId,
        }).then(setProduct);
    }, [productId]);

    // The product has not arrived from the backend
    if (!product) {
        return <p> Loading</p>;
    }

    // The vendorUserID on the product is the seller's user id,
    // which is what "View seller " navigates to
    return (
        <div>
            <button
                onClick={() => navigate("/")}
                style={{marginTop: "20px"}}
            >
                Back to products
            </button>
            <h1> {product.productName}</h1>
            {product.imageUrl && (
                <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="productDetailImage"
                />
            )}

            <p>{product.price} kr.</p>

            {product.description && (
                <p>{product.description}</p>
            )}
            <div className="qtySelector">
                <button disabled={qty <= 1} onClick={() => setQty(qty - 1)}>-</button>
                <span>{qty}</span>
                <button disabled={qty >= product.quantityAvailable} onClick={() => setQty(qty + 1)}>
                    +
                </button>
            </div>
            {selectedUser?.userId !== product.vendorUserId && (
                <button onClick={async () =>{
                    await addToCart(product, qty);
                    setQty(1);
                }}>
                    Add to cart 🛒
                </button>
            )}
            {product.quantitySold > 0 && (
                <div className="productBoughtInfo">
                    <p>Sold: {product.quantitySold}</p>

                    {product.firstBoughtAt && (
                        <p>
                            First bought:{" "}
                            {new Date(product.firstBoughtAt).toLocaleDateString()}
                        </p>
                    )}

                    {product.lastBoughtAt && (
                        <p>
                            Last bought:{" "}
                            {new Date(product.lastBoughtAt).toLocaleDateString()}
                        </p>
                    )}

                    {product.quantityAvailable === 0 && (
                        <p className="soldOut">Sold out</p>
                    )}
                </div>
            )}

            <p>Category: {product.categories?.map(c => c.categoryName).join(", ") ?? "No category"}</p>

            <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>

            <button
                onClick={() => navigate(`/users/${product.vendorUserId}`)}
                style={{marginRight: "10px"}}
            >
                View seller
            </button>
        </div>
    );
}