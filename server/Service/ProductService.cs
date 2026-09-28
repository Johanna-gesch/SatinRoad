using Infra;
using Infra.Entities;
using Service.DTOs.ProductDTOs;

namespace Service;

public class ProductService(IRepository<Product> productRepo)
{
    public void Insert(CreateProductDto dto)
    {
        var newProduct = new Product
        {
            ProductId = Guid.NewGuid().ToString(),
            ProductName = dto.ProductName,
        };
        
        productRepo.Insert(newProduct);
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
