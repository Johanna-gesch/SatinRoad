using Infra.Entities;
using Infra.Repositories;

namespace Tests.Stubs;

public class CartItemRepositoryStub : ICartItemRepository
{

    public List<CartItem> Store = new();

    public CartItem? GetCartItem(string userId, string productId)
    {
        return Store.FirstOrDefault(ci =>
            ci.UserId == userId && ci.ProductId == productId);
        
    }

    public void Add(string userId, string productid, int quantity)
    {
        Store.Add(new CartItem
        {
            CartItemId = Guid.NewGuid().ToString(),
            UserId = userId,
            ProductId = productid,
            Quantity = quantity
        });
    }

    public void UpdateQuantity(string userId, string productId, int quantity)
    {
        var item = Store.FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);
        if (item != null) item.Quantity = quantity;
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