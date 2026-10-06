namespace Service.DTOs.CartDTOs;

public class PriceResultDto
{
    public decimal TotalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalPrice { get; set; }
}