using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTOs.ProductDTOs;

namespace API.Controllers;

public class ProductController(ProductService service) : ControllerBase
{
    [HttpGet(nameof(GetProducts))]
    public List<Product> GetProducts()
    {
        return service.GetAll();
    }

    [HttpGet(nameof(GetProductById))]
    public Product? GetProductById(string id)
    {
        return service.GetById(id);
    }

    [HttpPost(nameof(CreateProduct))]
    public void CreateProduct(CreateProductDto dto)
    {
        service.Insert(dto);
    }

    [HttpPut(nameof(UpdateProduct))]
    public void UpdateProduct(UpdateProductDto dto)
    {
        service.Update(dto);
    }

    [HttpDelete(nameof(DeleteProduct))]
    public void DeleteProduct(string id)
    {
        service.Delete(id);
    }

    [HttpPut(nameof(BuyProduct))]
    public void BuyProduct(BuyProductDto dto)
    {
        service.Buy(dto);
    }
    
}