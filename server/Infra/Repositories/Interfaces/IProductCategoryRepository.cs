using Infra.Entities;

namespace Infra.Repositories;

public interface IProductCategoryRepository
{
    void Add(string productId, string categoryId);
    void Remove(string productId, string categoryId);
    void RemoveByProduct(string productId);
    void RemoveByCategory(string categoryId);
    List<Category> GetCategoriesForProduct(string productId);
    List<Product> GetProductsForCategory(string categoryId);
}