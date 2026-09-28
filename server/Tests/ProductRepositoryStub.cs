using Infra;
using Infra.Entities;

namespace Tests;

public class ProductRepositoryStub : IRepository<Product>
{
    public Product InsertedProduct;
    public void Insert(Product entity)
    {
        InsertedProduct = entity;
    }

    public Product? GetById(string id)
    {
        throw new NotImplementedException();
    }

    public void Update(Product entity)
    {
        throw new NotImplementedException();
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