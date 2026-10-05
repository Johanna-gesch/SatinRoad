using System.ComponentModel.DataAnnotations;
using Infra.Entities;
using Infra.Repositories;
using ValidationException = Infra.ValidationException;

namespace Service;

public class CartService(ICartItemRepository cartItemRepository, IProductRepository productRepository)
{
    public void AddToCart(string userId, string productId)
    {
        var product = productRepository.GetById(productId)
                      ?? throw new ValidationException("Product not found");
        var existing = cartItemRepository.GetCartItem(userId, productId);

        if (existing != null)
        {
            if (existing.Quantity + 1 > product.QuantityAvailable)
                throw new ValidationException("Not enough stock");
            
            cartItemRepository.UpdateQuantity(userId, productId, existing.Quantity + 1);
        }
        else
        {
            if (product.QuantityAvailable < 1)
                throw new ValidationException("Out of stock");
            cartItemRepository.Add(userId, productId);
        }
    }

    public void UpdateQuantity(string userId, string productId, int quantity)
    {
        var product = productRepository.GetById(productId)
                      ?? throw new ValidationException("Product not found");

        if (quantity > product.QuantityAvailable)
            throw new ValidationException("Not enough stock");
        
        if (quantity <= 0)
        {
            cartItemRepository.Remove(userId, productId);
            return;
        }
        
        cartItemRepository.UpdateQuantity(userId, productId, quantity);
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