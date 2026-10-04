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
    const [policeRaid, setPoliceRaid] = useState(false);
    const [policeRaidInfo, setPoliceRaidInfo] = useState<{
        vendorName: string;
        productNames: string[];
    } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        MyApi.getProducts.productGetProducts().then(r => {
            setProducts(r);
        });
    }, []);

    function handleBuy(product: Product) {
        MyApi.buyProduct.productBuyProduct({
            ProductId: product.productId,
            IsBought: true
        }).then(r => {

            if(r.policeRaid) {
                setPoliceRaid(true);

                setPoliceRaidInfo({
                    vendorName: r.deletedVendorName ?? "Unknown vendor",
                    productNames: r.deletedProductNames ?? []
                });
            } else {
                setPurchaseMessage(product.productName);
            }

            MyApi.getProducts.productGetProducts().then(r => {
                setProducts(r)
            })

        })
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

            {policeRaid && (
                <div className="purchasePopup">
                    <button
                        className="closeBtn"
                        onClick={() => {
                            setPoliceRaid(false);
                            setPoliceRaidInfo(null);
                        }}
                    >
                        X
                    </button>

                    <p>
                        🚨 WOOP WOOP! It's the sound of the Police!! 🚨
                    </p>
                    <p> It's now your fault that <b>{policeRaidInfo?.vendorName}</b> has been shut down and arrested, and you now no longer can buy:</p>
                    <div>
                        {policeRaidInfo?.productNames.map(productName => (
                            <div key={productName}>
                                {productName}
                            </div>
                        ))}
                    </div>
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

