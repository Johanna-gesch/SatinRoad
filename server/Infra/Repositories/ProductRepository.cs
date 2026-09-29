using System.ComponentModel.DataAnnotations;
using Infra.Entities;
using LinqToDB;

namespace Infra;

public class ProductRepository(MyDataConnection dc) : IRepository<Product>
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
        return dc.Products.ToList();
    }
}