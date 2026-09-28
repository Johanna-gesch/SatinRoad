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

    [HttpPost(nameof(CreateProduct))]
    public void CreateProduct(CreateProductDto dto)
    {
        service.Insert(dto);
    }
    
}