using Infra;
using Infra.Entities;

namespace Tests;

public class ProductRepositoryStub : IRepository<Product>
{
    public Product InsertedProduct;
    public Product? ExistingProduct;
    public Product? UpdatedProduct;
    public Product? DeletedProduct;
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

    public void Delete(Product entity)
    {
        DeletedProduct = entity;
    }

    public List<Product> GetAll()
    {
        throw new NotImplementedException();
    }
}