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
    public Product GetProductById(string id)
    {
        return service.GetById(id);
    }

    [HttpPost(nameof(CreateProduct))]
    public void CreateProduct([FromBody]CreateProductDto dto)
    {
        service.Insert(dto);
    }

    [HttpPut(nameof(UpdateProduct))]
    public void UpdateProduct([FromBody]UpdateProductDto dto)
    {
        service.Update(dto);
    }

    [HttpDelete(nameof(DeleteProduct))]
    public void DeleteProduct(string id)
    {
        service.Delete(id);
    }

    [HttpPut(nameof(BuyProduct))]
    public void BuyProduct([FromBody]BuyProductDto dto)
    {
        service.Buy(dto);
    }

    [HttpPost(nameof(UploadImage))]
    public IActionResult UploadImage(IFormFile file)
    {
        // Pass the file's raw stream, its original name (for the extension) and the current host to the service
        var imageUrl = service.SaveProductImage(
            file.OpenReadStream(),
            file.FileName,
            $"{Request.Scheme}://{Request.Host}"
        );
        // Return the saved  image's URL so the frontend can store it on the product
        return Ok(new { url = imageUrl });
    }
    
}