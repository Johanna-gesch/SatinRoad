import {useEffect, useRef, useState} from "react";
import type { Product, Category } from "@/api/Api.ts";
import { MyApi } from "@/Components/Products/ProductList.tsx";
import { compressImage } from "@/Utils/CompressImage.tsx";

type ProductEditPopupProps = {
    product: Product;
    onClose: () => void;
    onSaved: () => void;
};

export function ProductEditPopup({
    product,
    onClose,
    onSaved
}: ProductEditPopupProps) {

    // Local state for the fields in the edit form
    const [productName, setProductName] = useState(product.productName);

    const [quantityAvailable, setQuantityAvailable] = useState(
        product.quantityAvailable
    );

    const [imageUrl, setImageUrl] = useState(
        product.imageUrl ?? ""
    );
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [price, setPrice] = useState(product.price);

    const [description, setDescription] = useState(
        product.description ?? ""
    );

    // The IDs of the categories selected for this product
    const [categoryIds, setCategoryIds] = useState<string[]>(
        product.categories?.map(category =>
            category.categoryId.toString()
        ) ?? []
    );

    // All categories that exist in the database
    const [categories, setCategories] = useState<Category[]>([]);

    // Controls whether the category dropdown is open
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
        useState(false);


    // Get all available categories from the database
    useEffect(() => {
        MyApi.getAllCategories
            .categoryGetAllCategories()
            .then(setCategories);
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

    function handleRemoveImage() {
        setImageUrl("");
        setFileName(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleFileChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        setFileName(file.name);
        setIsUploading(true);

        try {
            const compressedBlob = await compressImage(file);

            const formData = new FormData();

            const imageFileName =
                `${file.name.replace(/\.[^/.]+$/, "")}.jpg`;

            formData.append(
                "file",
                compressedBlob,
                imageFileName
            );

            const res = await fetch(
                `${MyApi.baseUrl}/UploadImage`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error("Upload failed.");
            }

            const data = await res.json();

            setImageUrl(data.url);

        } catch (err) {
            console.log(err);
            setFileName(null);

        } finally {
            setIsUploading(false);
        }
    }

    function handleSave() {

        MyApi.updateProduct.productUpdateProduct({
            productId: product.productId,
            productName: productName,
            quantityAvailable: quantityAvailable,
            imageUrl: imageUrl,
            price: price,
            description: description,
            categoryIds: categoryIds
        })
            .then(() => {
                onSaved();
                onClose();
            });
    }


    return (
        <div className="editPopupOverlay">

            <div className="editPopup">

                <h2>Edit Product</h2>

                <label>
                    Title
                    <input
                        value={productName}
                        onChange={e =>
                            setProductName(e.target.value)
                        }
                    />
                </label>

                <label>
                    Quantity available
                    <input
                        type="number"
                        min="0"
                        value={quantityAvailable}
                        onChange={e =>
                            setQuantityAvailable(
                                Number(e.target.value)
                            )
                        }
                    />
                </label>

                <label>
                    Image

                    <div>
                        {imageUrl ? (
                            <>
                                <img
                                    src={imageUrl}
                                    alt={productName}
                                    className="editProductImage"
                                />

                                <button
                                    type="button"
                                    className="fileBtn"
                                    onClick={handleRemoveImage}
                                    disabled={isUploading}
                                >
                                    Remove image
                                </button>
                            </>
                        ) : (
                            <>
                                <label
                                    htmlFor="editImageUpload"
                                    className="fileBtn"
                                >
                                    Upload Image...
                                </label>

                                <input
                                    id="editImageUpload"
                                    type="file"
                                    className="fileInput"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/jpeg,image/png,image/webp"
                                />
                            </>
                        )}

                        <span>
                            {isUploading
                                ? "Uploading..."
                                : fileName}
                        </span>
                    </div>
                </label>

                <label>
                    Price
                    <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={e =>
                            setPrice(Number(e.target.value))
                        }
                    />
                </label>

                <label>
                    Category

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
                                    .map(category =>
                                        category.categoryName
                                    )
                                    .join(", ")
                            }

                            <span className="categoryArrow">
                                {isCategoryDropdownOpen
                                    ? "▲"
                                    : "▼"}
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
                                                {isSelected
                                                    ? "✓"
                                                    : ""}
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
                </label>

                <label>
                    Description
                    <br />

                    <textarea
                        className="txtArea"
                        value={description}
                        onChange={e =>
                            setDescription(e.target.value)
                        }
                    />
                </label>

                <div className="editPopupButtons">

                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}