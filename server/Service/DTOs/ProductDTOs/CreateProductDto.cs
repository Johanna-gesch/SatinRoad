namespace Service.DTOs.ProductDTOs;

public class CreateProductDto
{
    public string ProductName { get; set; }
    public List<string> CategoryIds { get; set; } = new();
}