using System.ComponentModel.DataAnnotations;
using Infra.Entities;
using Infra.Repositories;

namespace Service;

public class CartService(ICartItemRepository cartItemRepository, IProductRepository productRepository)
{
    public void AddToCart(string userId, string productId)
    {
        var product = productRepository.GetById(productId)
                      ?? throw new ValidationException("Product not found");
        if (cartItemRepository.Exists(userId, productId))
            throw new ValidationException("Already in cart");

        cartItemRepository.Add(userId, productId);
    }

    public void RemoveFromCart(string userId, string productId)
    {
        cartItemRepository.Remove(userId, productId);
    }

    public List<CartItem> GetCart(string userId)
    {
        return cartItemRepository.GetCartForUser(userId);
    }
}