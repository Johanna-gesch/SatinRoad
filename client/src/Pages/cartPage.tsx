import {useNavigate, useOutletContext} from "react-router-dom";
import type {CartItem, Product, User} from "@/api/Api.ts";
import {CartItemView} from "@/Pages/CartItemView.tsx";
import {MyApi} from "@/Components/Products/ProductList.tsx";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";

export function CartPage() {
    const { cart, selectedUser, setCart, products, setProducts } = useOutletContext<{
        cart: CartItem[];
        selectedUser: User | null;
        setCart: Dispatch<SetStateAction<CartItem[]>>;
        products: Product[];
        setProducts: Dispatch<SetStateAction<Product[]>>;
    }>()
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [policeRaid, setPoliceRaid] = useState(false);
    const [policeRaidInfo, setPoliceRaidInfo] = useState<{
        vendorNames: string[];
    } | null>(null);
    const [purchaseMessage, setPurchaseMessage] = useState<string[] | null>(null);
    const [purchasePrices, setPurchasePrices] = useState<{
        totalPrice: number;
        discountAmount: number;
        finalPrice: number;
    } | null>(null);

    const navigate = useNavigate();

    if (!selectedUser) return <p>Please log in</p>;

    useEffect(() => {
        async function getCartPrice() {
            if (!selectedUser || cart.length === 0) {
                setPurchasePrices(null);
                return;
            }

            try {
                const price = await MyApi.getCartPrice.cartGetCartPrice({
                    userId: selectedUser.userId
                });

                setPurchasePrices({
                    totalPrice: price.totalPrice ?? 0,
                    discountAmount: price.discountAmount ?? 0,
                    finalPrice: price.finalPrice ?? 0
                });
            } catch (err: any) {
                console.error(err);
            }
        }

        getCartPrice();
    }, [cart, selectedUser]);

    async function buyEntireCart() {
        try {
            const r = await MyApi.buy.cartBuy({
                userId: selectedUser?.userId
            })

            if (r.policeRaid) {
                setPoliceRaid(true);

                setPoliceRaidInfo({
                    vendorNames: r.deletedVendorNames ?? []
                })
            } else {
                setPurchaseMessage(
                    r.purchasedProductNames ?? []
                )
            }

            setCart([])

            const updatedProducts = await MyApi.getProducts.productGetProducts();

            setProducts(updatedProducts);

        } catch (err: any){
            alert(err?.message ?? "Could not complete purchase");
        }
    }

    return (
        <div>
            <button
                onClick={() => navigate("/")}
                style={{marginBottom: "20px"}}
            >
                Back to products
            </button>
            {purchaseMessage && (
                <div className="purchasePopup">
                    <button
                        className="closeBtn"
                        onClick={() => {
                            setPurchaseMessage(null);
                            setPurchasePrices(null);
                        }}
                    >
                        X
                    </button>

                    <p>You successfully bought:</p>

                    <div>
                        {purchaseMessage.map(productName => (
                            <div key={productName}>
                                {productName}
                            </div>
                        ))}
                    </div>

                    <p>😈</p>
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

                    <p>
                        It's now your fault that:
                    </p>

                    <div>
                        {policeRaidInfo?.vendorNames.map(vendorName => (
                            <div key={vendorName}>
                                <b>{vendorName}</b> got caught.
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h2>Your cart</h2>
            {cart.length === 0 && <p>Your cart is empty</p>}

            {cart.map(item => (
                <CartItemView key={item.cartItemId} item={item} />
            ))}

            {purchasePrices && (
                <div>
                    <p>Price: {purchasePrices.totalPrice} kr</p>
                    <p>Discount: -{purchasePrices.discountAmount} kr</p>
                    <p>Final price: {purchasePrices.finalPrice} kr</p>
                </div>
            )}

            {cart.length > 0 && (
                <button
                    className="buyBtn"
                    onClick={buyEntireCart}
                >
                    BUY NOW!
                </button>
            )}
        </div>
    )
}