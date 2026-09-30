using Infra.Entities;
using LinqToDB;

namespace Infra.Repositories;

public class ProductCategoryRepository(MyDataConnection dc): IProductCategoryRepository
{
    public void Add(string productId, string categoryId)
    {
        dc.Insert(new ProductCategory
        {
            ProductId = productId,
            CategoryId = categoryId
        });
    }

    public void Remove(string productId, string categoryId)
    {
        dc.GetTable<ProductCategory>()
            .Where(pc => pc.ProductId == productId && pc.CategoryId == categoryId)
            .Delete();
    }

    /**
     * This method deletes an association between a product and a category by using the product's id.
     */
    public void RemoveByProduct(string productId)
    {
        dc.GetTable<ProductCategory>()
            .Where(pc => pc.ProductId == productId)
            .Delete();
    }

    /**
     * This method deletes an association between a product and a category by using the category's id.
     */
    public void RemoveByCategory(string categoryId)
    {
        dc.GetTable<ProductCategory>()
            .Where(pc => pc.CategoryId == categoryId)
            .Delete();
    }

    public List<Category> GetCategoriesForProduct(string productId)
    {
        return dc.GetTable<ProductCategory>()
            .Where(pc => pc.ProductId == productId)
            .Join(
                dc.GetTable<Category>(),
                pc => pc.CategoryId,
                c => c.CategoryId,
                (pc, c) => c
            )
            .ToList();
    }

    public List<Product> GetProductsForCategory(string categoryId)
    {
        return dc.GetTable<ProductCategory>()
            .Where(pc => pc.CategoryId == categoryId)
            .Join(
                dc.GetTable<Product>(),
                pc => pc.ProductId,
                p => p.ProductId,
                (pc, p) => p
            )
            .ToList();
    }
}