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
    const [categoryIds, setCategoryIds] = useState<string[]>([]); // For sending chosen categories back to db
    const [categories, setCategories] = useState<Category[]>([]); // For getting the categories from db
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [quantityAvailable, setQuantityAvailable] = useState("");

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    useEffect(() => {
        MyApi.getAllCategories.categoryGetAllCategories().then(setCategories);
    }, []);

    function handleCategoryToggle(categoryId: string) {
        setCategoryIds(currentIds => {
            // If the category is already selected, remove it.
            if (currentIds.includes(categoryId)) {
                return currentIds.filter(id => id !== categoryId);
            }

            // Otherwise add it to the selected categories.
            return [...currentIds, categoryId];
        });
    }

    function handleCreateProduct() {
        if (!vendorUserId) return;

        MyApi.createProduct.productCreateProduct({
            productName: productNameField,
            categoryIds: categoryIds,
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
                setQuantityAvailable("")
                setCategoryIds([]);
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

            {fileName ? (
                <button
                    type="button"
                    className="fileBtn"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                >
                    Remove image
                </button>
            ) : (
                <>
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
                </>
            )}

            <span>
                {isUploading ? "Uploading..." : fileName}
            </span>

            {/* Category multi-select */}
            <div className="categoryDropdown">
                <button
                    type="button"
                    className="categorySelect"
                    onClick={() =>
                        setIsCategoryDropdownOpen(
                            current => !current
                        )
                    }
                >
                    {categoryIds.length === 0
                        ? "Select categories"
                        : categories
                            .filter(category =>
                                categoryIds.includes(
                                    category.categoryId.toString()
                                )
                            )
                            .map(category => category.categoryName)
                            .join(", ")
                    }

                    <span className={"categoryArrow"}>
                        {isCategoryDropdownOpen ? "▲" : "▼"}
                    </span>
                </button>

                {isCategoryDropdownOpen && (
                    <div className="categoryDropdownMenu">

                        {categories.map(category => {
                            const isSelected =
                                categoryIds.includes(
                                    category.categoryId.toString()
                                );

                            return (
                                <button
                                    type="button"
                                    key={category.categoryId}
                                    className={`categoryOption ${
                                        isSelected
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategoryToggle(
                                            category.categoryId.toString()
                                        )
                                    }
                                >
                                    <span className="categoryCheckmark">
                                        {isSelected ? "✓" : ""}
                                    </span>

                                    <span>
                                        {category.categoryName}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
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
