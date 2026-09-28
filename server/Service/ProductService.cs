using Infra;
using Infra.Entities;

namespace Service;

public class ProductService(IRepository<Product> productRepo)
{
    public void Insert(Product entity)
    {
        throw new NotImplementedException();
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
        return productRepo.GetAll();
    }
}
