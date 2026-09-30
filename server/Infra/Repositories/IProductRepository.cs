using Infra.Entities;

namespace Infra.Repositories;

public interface IProductRepository : IRepository<Product>
{
    void DeleteByCategoryId(string categoryId);
}