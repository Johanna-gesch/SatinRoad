using LinqToDB.Mapping;

namespace Service.DTOs.ProductDTOs;

public class UpdateProductDto
{
    [NotNull] public string ProductId { get; set; } = "";
    public string ProductName { get; set; } = "";
    public List<string> CategoryIds { get; set; } = new();
}