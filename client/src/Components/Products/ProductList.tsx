import {Api, type Category, type Product, type User} from "@/api/Api.ts";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCartActions} from "@/Hooks/UseCartActions.tsx";

export const MyApi = new Api();

type ProductListProps = {
    products: Product[];
    setProducts: Dispatch<SetStateAction<Product[]>>;
    activeUser: User | null;
    selectedCategory: string | null;
};

export function ProductList({products, setProducts, activeUser, selectedCategory}: ProductListProps) {
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
    const {addToCart} = useCartActions();
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [policeRaid, setPoliceRaid] = useState(false);
    const [search, setSearch] = useState("");
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
        const qty = quantities[product.productId] ?? 1;

        MyApi.buyProduct.productBuyProduct({
            productId: product.productId,
            quantity: qty,
        }).then(r => {

            if (r.policeRaid) {
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

    function changeQty(productId: string, delta: number, max: number) {
        setQuantities(q => {
            const current = q[productId] ?? 1;
            const updated = current + delta;

            return {
                ...q,
                [productId]: Math.max(1, Math.min(max, updated))
            };
        })
    }

    return (
        <>
            <input
                placeholder={"Search"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

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
                    <p> It's now your fault that <b>{policeRaidInfo?.vendorName}</b> has been shut down and arrested,
                        and you now no longer can buy:</p>
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

                    // Search-feltet
                    .filter(product =>
                        product.productName.toLowerCase().includes(search.toLowerCase())
                    )

                    // Category-filter
                    .filter(product =>
                        selectedCategory === null ||
                        product.categories?.some(
                            category => category.categoryId === selectedCategory
                        )
                    )
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


                            <div className="qtySelector">
                                <button
                                    disabled={(quantities[product.productId] ?? 1) <= 1}
                                    onClick={() =>
                                        changeQty(product.productId, -1, product.quantityAvailable)
                                    }
                                >
                                    -
                                </button>
                                <span>{quantities[product.productId] ?? 1}</span>

                                <button disabled={(quantities[product.productId] ?? 1) >= product.quantityAvailable}
                                        onClick={() =>
                                            changeQty(product.productId, +1, product.quantityAvailable)}>
                                    +
                                </button>
                            </div>
                            <button
                                onClick={async () => {
                                    const qty = quantities[product.productId] ?? 1;
                                    try {
                                        await addToCart(product, qty);
                                    } catch (err: any) {
                                        alert(err?.message ?? "Could not add to cart");
                                    }
                                }}
                            >
                                Add to cart 🛒
                            </button>

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

