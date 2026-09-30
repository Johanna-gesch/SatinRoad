import {Api, type Product} from "@/api/Api.ts";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export const MyApi = new Api();

type ProductListProps = {
    products: Product[];
    setProducts: Dispatch<SetStateAction<Product[]>>;
};

export function ProductList({products, setProducts}: ProductListProps) {
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        MyApi.getProducts.productGetProducts().then(r => {
            setProducts(r);
        });
    }, []);

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

    function handleDelete(product: Product) {
        MyApi.deleteProduct.productDeleteProduct({id: product.productId})
            .then(r => {
                MyApi.getProducts.productGetProducts().then(r => {
                    setProducts(r)
                })
            })
    }

    function handleBuy(product: Product) {
        MyApi.buyProduct.productBuyProduct({
            ProductId: product.productId,
            IsBought: product.isBought,
            BoughtAt: product.boughtAt
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
                    <br />
                    😈
                </div>
            )}

            <div className={"products"}>
                {products.map(product => (
                    <div key={product.productId} className={"productCard"}>
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
                            <button
                                className="productNameBtn"
                                onClick={() => navigate(`/products/${product.productId}`)}
                                >
                                {product.productName}
                            </button>
                        )}
                        <br></br>
                        <div className={"productBtns"}>
                            <button onClick={() => handleEditOrSaveProduct(product)}>
                                {editingProductId === product.productId ? "Save" : "Edit"}
                            </button>
                            <button onClick={() => handleDelete(product)}>Delete</button>
                        </div>
                        <button className={"buyBtn"} onClick={() => handleBuy(product)}>BUY NOW!</button>
                    </div>
                ))}
            </div>
        </>
    );
}

