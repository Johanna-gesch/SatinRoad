using Infra.Entities;
using Infra.Repositories;

namespace Tests.Stubs;

public class ProductCategoryRepositoryStub : IProductCategoryRepository
{
    public List<ProductCategory> Store = new();
    
    public void Add(string productId, string categoryId)
    {
        Store.Add(new ProductCategory
        {
            ProductId = productId,
            CategoryId = categoryId
        });
    }

    public void Remove(string productId, string categoryId)
    {
        Store.RemoveAll(pc => pc.ProductId == productId && pc.CategoryId == categoryId);
    }

    public void RemoveByProduct(string productId)
    {
        Store.RemoveAll(pc => pc.ProductId == productId);
    }

    public void RemoveByCategory(string categoryId)
    {
        Store.RemoveAll(pc => pc.CategoryId == categoryId);
    }

    public List<Category> GetCategoriesForProduct(string productId)
    {
        return Store.Where(pc => pc.ProductId == productId)
            .Select(pc => new Category() { CategoryId = pc.CategoryId })
            .ToList();
    }

    public List<Product> GetProductsForCategory(string categoryId)
    {
        return Store.Where(pc => pc.CategoryId == categoryId)
            .Select(pc => new Product() { ProductId = pc.ProductId })
            .ToList();    }
}