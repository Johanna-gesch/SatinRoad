import {Api, type Product, type User} from "@/api/Api.ts";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export const MyApi = new Api();

type ProductListProps = {
    products: Product[];
    setProducts: Dispatch<SetStateAction<Product[]>>;
    activeUser: User | null;
};

export function ProductList({products, setProducts, activeUser}: ProductListProps) {
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        MyApi.getProducts.productGetProducts().then(r => {
            setProducts(r);
        });
    }, []);

    function handleBuy(product: Product) {
        MyApi.buyProduct.productBuyProduct({
            productId: product.productId,
            isBought: true,
            boughtAt: new Date().toISOString(),
        }).then(r => {
            MyApi.getProducts.productGetProducts().then(r => {
                setProducts(r)
            })
        })

        setPurchaseMessage(product.productName);

    }

    return (
        <>
            {purchaseMessage && (
                <div className="purchasePopup">
                    <button className={"closeBtn"} onClick={() => setPurchaseMessage(null)}>X</button>
                    You successfully bought {purchaseMessage}
                    <br/>
                    😈
                </div>
            )}

            <div className={"products"}>
                {products
                    .filter(product => product.vendorUserId !== activeUser?.userId)
                    .map(product => (
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

                        <button
                            className="productNameBtn"
                            onClick={() => navigate(`/products/${product.productId}`)}
                        >
                            {product.productName}
                        </button>

                        <p className="productPrice">
                            {product.price} kr.
                        </p>

                        <p className="productTimestamp">
                            Created:{" "}
                            {new Date(product.createdAt).toLocaleDateString()}
                        </p>

                        {product.isBought && product.boughtAt && (
                            <p className="productBoughtAt">
                                Bought:{" "}
                                {new Date(product.boughtAt).toLocaleDateString()}
                            </p>
                        )}

                        <button
                            className="buyBtn"
                            onClick={() => handleBuy(product)}
                        >
                            BUY NOW!
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

