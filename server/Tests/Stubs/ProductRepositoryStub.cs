using Infra;
using Infra.Entities;
using Infra.Repositories;

namespace Tests;

public class ProductRepositoryStub : IProductRepository
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

    public List<Product> GetByVendorUserId(string vendorUserId)
    {
        return new List<Product>();
    }
    
}