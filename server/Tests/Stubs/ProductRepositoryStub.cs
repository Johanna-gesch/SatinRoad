using Infra;
using Infra.Entities;

namespace Tests;

public class ProductRepositoryStub : IRepository<Product>
{
    public Product InsertedProduct;
    public Product? ExistingProduct;
    public Product? UpdatedProduct;
    public void Insert(Product entity)
    {
        InsertedProduct = entity;
    }

    public Product? GetById(string id)
    {
        return ExistingProduct;
    }

    public void Update(Product entity)
    {
        UpdatedProduct = entity;
    }

    public void Delete(string id)
    {
        throw new NotImplementedException();
    }

    public List<Product> GetAll()
    {
        throw new NotImplementedException();
    }
}