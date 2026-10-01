using Infra.Entities;

namespace Infra.Repositories;

public class NullProductRepository : IProductRepository
{
    public void Insert(Product entity)
    { }

    public Product? GetById(string id) => null;

    public void Update(Product entity)
    { }

    public void Delete(Product entity)
    { }

    public List<Product> GetAll() => new();
    public List<Product> GetByVendorUserId(string vendorUserId) => null;
    
}