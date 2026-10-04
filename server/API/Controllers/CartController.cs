using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTOs.CartDTOs;

namespace API.Controllers;

public class CartController(CartService service) : ControllerBase
{
    [HttpPost(nameof(AddToCart))]
    public void AddToCart([FromQuery]AddToCartDto dto)
    {
        service.AddToCart(dto.UserId, dto.ProductId);
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
}