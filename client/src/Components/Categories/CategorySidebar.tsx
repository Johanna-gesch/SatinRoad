import type {Category} from "@/api/Api.ts";

type CategorySidebarProps = {
    categories: Category[];
    selectedCategory: string | null;
    setSelectedCategory: (value: string | null) => void;
};

export function CategorySidebar({
                                    categories,
                                    selectedCategory,
                                    setSelectedCategory
                                }: CategorySidebarProps) {

    return (
        <aside className="category-sidebar">
            <h3>Categories</h3>

            {/* Viser alle produkter igen */}
            <button
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "selected" : ""}
            >
                All
            </button>

            {/* Viser én knap for hver kategori */}
            {categories.map(category => (
                <button
                    key={category.categoryId}
                    onClick={() => setSelectedCategory(category.categoryId)}
                    className={
                        selectedCategory === category.categoryId
                            ? "selected"
                            : ""
                    }
                >
                    {category.categoryName}
                </button>
            ))}
        </aside>
    );
}