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
    const [quantityAvailable, setQuantityAvailable] = useState("");

        useEffect(() => {
            MyApi.getAllCategories.categoryGetAllCategories().then(setCategories);
        }, []);
    function handleCreateProduct() {
        if (!vendorUserId) return;

        MyApi.createProduct.productCreateProduct({
            productName: productNameField,
            categoryIds: [categoryId],
            vendorUserId: vendorUserId,
            price: Number(price) || 0,
            description: description,
            imageUrl: imageUrl,
            quantityAvailable: Number(quantityAvailable) || 0,
        })
            .then(() => {
                setProductNameField("");
                setPrice("");
                setDescription("");
                setImageUrl("");
                setFileName(null);

                setCategoryId("");
                onProductCreated();
            })
        if (!vendorUserId) {
            return<p>Sign in for creating a product</p>
        }
    }

    function handleRemoveImage() {
        setImageUrl("");
        setFileName(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
            const imageFileName = `${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
            formData.append("file", compressedBlob, imageFileName);

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

            <label htmlFor="imageUpload" className="fileBtn">
                Upload Image...
            </label>
            <input
                id="imageUpload"
                type="file"
                className="fileInput"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
            />
            <span>{isUploading ? "Uploading..." : fileName}</span>
            {fileName && (
                <button
                    type="button"
                    onClick={handleCreateProduct}
                    disabled={isUploading}
                    >
                    Remove image
                </button>
            )}
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId.toString()}>
                        {c.categoryName}
                    </option>
                ))}
            </select>
            <input
                placeholder="Quantity Available"
                type="number"
                value={quantityAvailable}
                onChange={e => setQuantityAvailable(e.target.value)}
            />
            <button onClick={handleCreateProduct} disabled={isUploading}> Create </button>
        </div>
    );
}
