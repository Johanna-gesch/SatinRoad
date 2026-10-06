using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTOs.CartDTOs;
using Service.DTOs.ProductDTOs;

namespace API.Controllers;

public class CartController(CartService service) : ControllerBase
{
    [HttpPost(nameof(AddToCart))]
    public void AddToCart([FromQuery]AddToCartDto dto)
    {
        service.AddToCart(dto.UserId, dto.ProductId);
    }

    [HttpPut(nameof(UpdateQuantity))]
    public void UpdateQuantity([FromQuery] UpdateQuantityDto dto)
    {
        service.UpdateQuantity(dto.UserId, dto.ProductId, dto.Quantity);
    }
    
    [HttpDelete(nameof(RemoveFromCart))]
    public void RemoveFromCart([FromQuery]RemoveFromCartDto dto)
    {
        service.RemoveFromCart(dto.UserId, dto.ProductId);
    }

    [HttpGet(nameof(GetCart))]
    public List<CartItem> GetCart([FromQuery]string userId)
    {
        return service.GetCart(userId);
    }
    
    [HttpPost(nameof(Buy))]
    public BuyResultDto Buy([FromQuery] string userId)
    {
        return service.Buy(userId);
    }

    [HttpGet(nameof(GetCartPrice))]
    public PriceResultDto GetCartPrice([FromQuery] string userId)
    {
        return service.GetCartPrice(userId);
    }
}