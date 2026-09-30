using Infra;
using Infra.Entities;
using Service.DTOs.ProductDTOs;
using ValidationException = Infra.ValidationException;

namespace Service;

public class ProductService(IRepository<Product> productRepo)
{
    public void Insert(CreateProductDto dto)
    {
        var newProduct = new Product
        {
            ProductId = Guid.NewGuid().ToString(),
            ProductName = dto.ProductName,
            CategoryId = dto.CategoryId
        };
        
        productRepo.Insert(newProduct);
    }

    public Product? GetById(string id)
    {
        return productRepo.GetById(id);
    }

    public void Update(UpdateProductDto dto)
    {
        var product = productRepo.GetById(dto.ProductId) ??
            throw new ValidationException("Product not found");
        
        if (!string.IsNullOrWhiteSpace(dto.ProductName))
            product.ProductName = dto.ProductName;
        
        productRepo.Update(product);
    }

    public void Delete(string id)
    {
        var product = productRepo.GetById(id) ??
            throw new ValidationException("Product not found");
        
        productRepo.Delete(product);
    }
    
    public List<Product> GetAll()
    {
        return productRepo.GetAll();
    }
}
