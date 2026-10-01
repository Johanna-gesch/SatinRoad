using Infra.Entities;

namespace Infra.Repositories;

public interface ICartItemRepository
{
    void Add(string userId, string productid);

    void Remove(string userId, string productId);

    List<CartItem> GetCartForUser(string userId);

    bool Exists(string userId, string productId);
}