import {useNavigate, useOutletContext} from "react-router-dom";
import type {CartItem, Product, User} from "@/api/Api.ts";
import {CartItemView} from "@/Pages/CartItemView.tsx";
import {MyApi} from "@/Components/Products/ProductList.tsx";
import {type Dispatch, type SetStateAction, useState} from "react";

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
        vendorName: string;
        productNames: string[];
    } | null>(null);
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    if (!selectedUser) return <p>Please log in</p>;

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )

    async function buyEntireCart() {
        try {
            for (const item of cart) {
                const r = await MyApi.buyProduct.productBuyProduct({
                    productId: item.productId,
                    quantity: item.quantity,
                });

                if (r.policeRaid) {
                    setPoliceRaid(true);
                    setPoliceRaidInfo({
                        vendorName: r.deletedVendorName ?? "Unknown vendor",
                        productNames: r.deletedProductNames ?? []
                    });
                } else {
                    setPurchaseMessage(item.product.productName)
                }
            }
            for (const item of cart) {
                await MyApi.removeFromCart.cartRemoveFromCart({
                    UserId: selectedUser?.userId,
                    ProductId: item.productId,
                })
            }

            setCart([]);

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
            <h2>Your cart</h2>
            {cart.length === 0 && <p>Your cart is empty</p>}

            {cart.map(item => (
                <CartItemView key={item.cartItemId} item={item} />
            ))}

            <p>Total price: {totalPrice} kr</p>

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