namespace Service.DTOs.CartDTOs;

public class UpdateQuantityDto
{
    public string UserId { get; set; } = "";
    public string ProductId { get; set; } = "";
    public int Quantity { get; set; }
}