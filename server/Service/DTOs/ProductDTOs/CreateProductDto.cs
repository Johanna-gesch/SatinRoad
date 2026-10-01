namespace Service.DTOs.ProductDTOs;

public class CreateProductDto
{
    public string ProductName { get; set; }
    public List<string> CategoryIds { get; set; } = new();
    
    public string VendorUserId { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    
    
}