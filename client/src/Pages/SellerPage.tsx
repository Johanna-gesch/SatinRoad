import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {User} from "@/api/Api.ts";
import {MyApi} from "@/Components/Products/ProductList.tsx";


/**
 * SellerPage
 * Page for seller (/users/:userId).
 * It reads the user id from the URL, fetches that user together with their
 * products and shows the name and every product they have for sale as cards.
 * Clicking a card opens that product's page; the button returns to the front page.
 * @constructor
 */
export function SellerPage() {
    const {userId} = useParams(); // the id from the URL
    const navigate = useNavigate(); // used for switching page

    const [user, setUser] = useState<User | null>(null);

    // Fetch the seller and their products whenever the id in the URL changes
    useEffect(() => {
        if (!userId) return;

        MyApi.getUserWithProducts.userGetUserWithProducts({
            id: userId
        }).then(setUser);
    }, [userId]);

    // The user has not arrived
    if (!user) {
        return <p>Loading</p>
    }

    // Each product card navigates to /product/:productId on click
    return (
        <div>
            <h1>{user.userName}</h1>

            <h2>Products for sale</h2>

            <div className="products">
                {user.products
                    .filter(product => !product.isBought)
                    .map(product => (
                    <div
                        key={product.productId}
                        className="productCard"
                        onClick={() =>
                            navigate(`/products/${product.productId}`)
                        }
                    >
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.productName}
                                className="productImage"
                                />
                        )}
                        {product.productName}
                    </div>
                ))}
            </div>

            <button onClick={() => navigate("/")}>
                Back to products
            </button>
        </div>
    );
}