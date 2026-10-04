using Infra.Entities;
using Infra.Repositories;

namespace Tests.Stubs;

public class CartItemRepositoryStub : ICartItemRepository
{

    public List<CartItem> Store = new();
    
    public void Add(string userId, string productid)
    {
        Store.Add(new CartItem
        {
            CartItemId = Guid.NewGuid().ToString(),
            UserId = userId,
            ProductId = productid
        });
    }

    public void Remove(string userId, string productId)
    {
        Store.RemoveAll(ci => ci.UserId == userId && ci.ProductId == productId);
    }

    public List<CartItem> GetCartForUser(string userId)
    {
        return Store.Where(ci => ci.UserId == userId).ToList();
    }

    public bool Exists(string userId, string productId)
    {
        return Store.Any(ci => ci.UserId == userId && ci.ProductId == productId);
    }
}