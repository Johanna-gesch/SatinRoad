import {Api, type Product, type Category} from "@/api/Api.ts";
import {useState, type Dispatch, type SetStateAction, useEffect} from "react";

export const MyApi = new Api();

type ProductCreateFormState = {
    setProducts: Dispatch<SetStateAction<Product[]>>;
    vendorUserId: string | null;
}

export function ProductCreateForm({ setProducts, vendorUserId }: ProductCreateFormState) {
    const [productNameField, setProductNameField] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

        useEffect(() => {
            MyApi.getAll.categoryGetAll().then(setCategories);
        }, []);

    function handleCreateProduct() {
        MyApi.createProduct.productCreateProduct({ ProductName: productNameField, CategoryIds: [categoryId] })
            .then(() => setProductNameField(""))
        if (!vendorUserId) return;

        MyApi.createProduct.productCreateProduct({
            ProductName: productNameField,
            CategoryIds: [categoryId],
            VendorUserId: vendorUserId,
            Price: Number(price) || 0,
            Description: description || null,
            ImageUrl: imageUrl || null,
        })
            .then(() => {
                setProductNameField("");
                setPrice("");
                setDescription("");
                setImageUrl("");
            })
            .then(() => {
                MyApi.getProducts.productGetProducts().then(r => {
                    setProducts(r);
                });
            });
        if (!vendorUserId) {
            return<p>Sign in for creating a product</p>
        }
    }

    return (
        <div>
            Create Product:
            <input placeholder="Product Name" value={productNameField} onChange={e => setProductNameField(e.target.value)} />
            <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <input placeholder="Description" type="textarea" value={description} onChange={e => setDescription(e.target.value)} />
            <input placeholder="Image Url" type="file" onChange={e => setImageUrl(e.target.value)} />
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
