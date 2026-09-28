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
        return dc.Products.ToList();
    }
}