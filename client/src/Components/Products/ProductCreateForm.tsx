import {Api, type Product, type Category} from "@/api/Api.ts";
import {useState, type Dispatch, type SetStateAction, useEffect} from "react";

export const MyApi = new Api();

export function ProductCreateForm({ setProducts }: {
    setProducts: Dispatch<SetStateAction<Product[]>>
})
    {

    const [productNameField, setProductNameField] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);

        useEffect(() => {
            MyApi.getAll.categoryGetAll().then(setCategories);
        }, []);

    function handleCreateProduct() {
        MyApi.createProduct.productCreateProduct({ ProductName: productNameField, CategoryIds: [categoryId] })
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
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId.toString()}>
                        {c.categoryName}
                    </option>
                ))}
            </select>
            <button onClick={handleCreateProduct}>Create</button>
        </div>
    );
}
