using LinqToDB.Mapping;

namespace Service.DTOs.ProductDTOs;

public class UpdateProductDto
{
    [NotNull] public string ProductId { get; set; } = "";
    public string ProductName { get; set; } = "";
    public List<string> CategoryIds { get; set; } = new();
    
    public decimal? Price { get; set; }
    
    public string? Description { get; set; }
    
    public string? ImageUrl { get; set; }
}