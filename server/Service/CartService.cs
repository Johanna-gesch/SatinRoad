using System.ComponentModel.DataAnnotations;
using Infra.Entities;
using Infra.Repositories;
using ValidationException = Infra.ValidationException;

namespace Service;

public class CartService(ICartItemRepository cartItemRepository, IProductRepository productRepository)
{
    public void AddToCart(string userId, string productId, int quantity = 1)
    {
        if (quantity < 1)
            throw new ValidationException("Quantity must be at least 1");
        
        var product = productRepository.GetById(productId)
                      ?? throw new ValidationException("Product not found");
        
        var existing = cartItemRepository.GetCartItem(userId, productId);
        var newQuantity = (existing?.Quantity ?? 0) + quantity;

        if (newQuantity > product.QuantityAvailable)
            throw new ValidationException("Out of stock");
        
        
        if (existing == null)
            cartItemRepository.Add(userId, productId, quantity);
        else
            cartItemRepository.UpdateQuantity(userId, productId, newQuantity);
        
    }
    

    public void UpdateQuantity(string userId, string productId, int quantity)
    {
        var product = productRepository.GetById(productId)
                      ?? throw new ValidationException("Product not found");
        if (quantity <= 0)
        {
            cartItemRepository.Remove(userId, productId);
            return;
        }
        
        if (quantity > product.QuantityAvailable)
            throw new ValidationException("Not enough stock");
        

        var existing = cartItemRepository.GetCartItem(userId, productId);

        if (existing == null)
            throw new ValidationException("Item not in cart");
        
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