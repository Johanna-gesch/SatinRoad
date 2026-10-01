using Infra;
using Infra.Entities;
using Infra.Repositories;
using Service.DTOs.ProductDTOs;
using ValidationException = Infra.ValidationException;

namespace Service;

public class ProductService
{
    private readonly IProductRepository productRepo;
    private readonly IProductCategoryRepository productCategoryRepo;

    public ProductService(
        IProductRepository productRepo,
        IProductCategoryRepository productCategoryRepo)
    {
        this.productRepo = productRepo;
        this.productCategoryRepo = productCategoryRepo;
    }

    public void Insert(CreateProductDto dto)
    {
        var newProduct = new Product
        {
            ProductId = Guid.NewGuid().ToString(),
            ProductName = dto.ProductName,
            VendorUserId = dto.VendorUserId,
            Price = dto.Price,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow,
        };

        if (dto.CategoryIds.Count == 0)
            throw new ValidationException("Product must have at least one category.");

        productRepo.Insert(newProduct);

        foreach (var categoryId in dto.CategoryIds)
        {
            productCategoryRepo.Add(newProduct.ProductId, categoryId);
        }
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
        
        if (dto.CategoryIds.Count == 0)
            throw new ValidationException("Product must have at least one category.");

        productRepo.Update(product);
        
        //Remove old links
        productCategoryRepo.RemoveByProduct(dto.ProductId);

        //Add new links
        foreach (var categoryId in dto.CategoryIds)
        {
            productCategoryRepo.Add(dto.ProductId, categoryId);
        }
    }

    public void Delete(string id)
    {
        var product = productRepo.GetById(id) ??
                      throw new ValidationException("Product not found");

        //Remove category links
        productCategoryRepo.RemoveByProduct(id);

        productRepo.Delete(product);
    }

    public List<Product> GetAll()
    {
        return productRepo.GetAll();
    }

    public void Buy(BuyProductDto dto)
    {
        var product = productRepo.GetById(dto.ProductId) ??
                      throw new ValidationException("Product not found");

        if (product.IsBought)
            throw new ValidationException("Product has already been bought");

        product.IsBought = true;
        product.BoughtAt = DateTime.UtcNow;

        productRepo.Update(product);
    }

    public string SaveProductImage(Stream fileStream, string originalFileName, string baseUrl)
    {
        // Only allow common image formats
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
            throw new ValidationException("Only jpg, png and webp image are allowed");

        // Make sure the target folder exists before writing to it
        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        Directory.CreateDirectory(uploadsDir);

        // Generate a unique file name so uploads never overwrite each other
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        // Write the uploaded file's contents to disk
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            fileStream.CopyTo(stream);
        }

        // Build the public URL the frontend can use to display the image
        return $"{baseUrl}/images/{fileName}";

    }
}