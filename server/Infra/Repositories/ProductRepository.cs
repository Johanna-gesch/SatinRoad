using System.ComponentModel.DataAnnotations;
using Infra.Entities;
using Infra.Repositories;
using LinqToDB;

namespace Infra;

public class ProductRepository(MyDataConnection dc) : IProductRepository
{
    public void Insert(Product entity)
    {
        dc.Insert(entity);
    }

    public Product? GetById(string id)
    {
        return dc.Products.FirstOrDefault(p => p.ProductId == id);
    }

    public void Update(Product entity)
    {
        dc.Update(entity);
    }

    public void Delete(Product entity)
    {
        dc.Delete(entity);
    }
    
    public List<Product> GetAll()
    {
        return dc.Products
            .Where(p => p.IsBought == false)
            .ToList();
    }

    public void DeleteByCategoryId(string categoryId)
    {
        dc.GetTable<Product>()
            .Where(p => p.CategoryId == categoryId)
            .Delete();
    }
}