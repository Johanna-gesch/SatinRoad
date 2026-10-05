using Infra.Entities;

namespace Infra.Repositories;

public interface ICartItemRepository
{
    CartItem? GetCartItem(string userId, string productId);
    
    void Add(string userId, string productid);

    void UpdateQuantity(string userId, string productId, int quantity);

    void Remove(string userId, string productId);

    List<CartItem> GetCartForUser(string userId);

    bool Exists(string userId, string productId);
}