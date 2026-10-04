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
            <button
                onClick={() => addToCart(product)}>
                Add to cart 🛒
            </button>

            <p>Category: {product.categories?.map(c => c.categoryName).join(", ") ?? "No category"}</p>

            <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>

            {product.isBought && product.boughtAt && (
                <p>Bought: {new Date(product.boughtAt).toLocaleDateString()}</p>
            )}

            <button
                onClick={() => navigate(`/users/${product.vendorUserId}`)}
            >
                View seller
            </button>
            <button onClick={() => navigate("/")}>
                Back to products
            </button>
        </div>
    );
}