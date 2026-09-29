import {Api, type Product} from "@/api/Api.ts";
import {useState, type Dispatch, type SetStateAction} from "react";

export const MyApi = new Api();

export function ProductCreateForm({ setProducts }: {
    setProducts: Dispatch<SetStateAction<Product[]>>
})
    {

    const [productNameField, setProductNameField] = useState("");

    function handleCreateProduct() {
        MyApi.createProduct.productCreateProduct({ ProductName: productNameField })
            .then(() => setProductNameField(""))
            .then(() => {
                MyApi.getProducts.productGetProducts().then(r => {
                    setProducts(r);
                });
            });
    }

    return (
        <div>
            Create Product:
            <input
                placeholder={"Product Name"}
                value={productNameField}
                onChange={e => setProductNameField(e.target.value)}
            ></input>
            <button onClick={handleCreateProduct}>Create</button>
        </div>
    );
}
