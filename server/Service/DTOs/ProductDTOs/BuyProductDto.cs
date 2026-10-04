using LinqToDB.Mapping;

namespace Service.DTOs.ProductDTOs;

public class BuyProductDto
{
    [NotNull] public string ProductId { get; set; } = "";
    public bool IsBought { get; set; } = false;
}