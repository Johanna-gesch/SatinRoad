using LinqToDB.Mapping;

namespace Service.DTOs.ProductDTOs;

public class BuyProductDto
{
    [NotNull] public string ProductId { get; set; } = "";
    public int Quantity { get; set; } = 1;
}