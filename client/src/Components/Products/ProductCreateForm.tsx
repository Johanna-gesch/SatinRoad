import {Api, type Product, type Category} from "@/api/Api.ts";
import {useState, type Dispatch, type SetStateAction, useEffect, useRef} from "react";
import {compressImage} from "@/Utils/CompressImage.tsx";

export const MyApi = new Api();

type ProductCreateFormState = {
    vendorUserId: string | null;
    onProductCreated: () => void;
}

export function ProductCreateForm({ vendorUserId, onProductCreated }: ProductCreateFormState) {
    const [productNameField, setProductNameField] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            ImageUrl: imageUrl,
        })
            .then(() => {
                setProductNameField("");
                setPrice("");
                setDescription("");
                setImageUrl("");
                setFileName(null);

                onProductCreated();
            })
        if (!vendorUserId) {
            return<p>Sign in for creating a product</p>
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsUploading(true);

        try{
            const compressedBlob = await  compressImage(file);

            const formData = new FormData();
            formData.append("file", compressedBlob, file.name);

            const res = await fetch (`${MyApi.baseUrl}/UploadImage`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error ("Upload failed.");

            const data = await res.json();
            setImageUrl(data.url);
        }catch(err){
            console.log(err);
            setFileName(null);
        }finally{
            setIsUploading(false);
        }
    }

    return (
        <div>
            Create Product:
            <input placeholder="Product Name" value={productNameField} onChange={e => setProductNameField(e.target.value)} />
            <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <input placeholder="Description" type="textarea" value={description} onChange={e => setDescription(e.target.value)} />

            <input type="file" onChange={handleFileChange} accept="image/jpeg,image/png,image/webp"/>
            <span>{isUploading ? "Uploading..." : fileName}</span>

            <label htmlFor="imageUpload" className="fileBtn">
                Browse...
            </label>
            <input
                id="imageUpload"
                type="file"
                className="fileInput"
                onChange={e => setImageUrl(e.target.value)}
            />
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId.toString()}>
                        {c.categoryName}
                    </option>
                ))}
            </select>
            <button onClick={handleCreateProduct} disabled={isUploading}> Create </button>
        </div>
    );
}
