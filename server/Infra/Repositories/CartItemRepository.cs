using Infra.Entities;
using LinqToDB;

namespace Infra.Repositories;

public class CartItemRepository(MyDataConnection dc) : ICartItemRepository
{
    public void Add(string userId, string productid)
    {
        dc.Insert(new CartItem
        {
            CartItemId = Guid.NewGuid().ToString(),
            UserId = userId,
            ProductId = productid
        });
    }

    public void Remove(string userId, string productId)
    {
        dc.GetTable<CartItem>()
            .Where(ci => ci.UserId == userId && ci.ProductId == productId)
            .Delete();
    }

    public List<CartItem> GetCartForUser(string userId)
    {
        return dc.GetTable<CartItem>()
            .Where(ci => ci.UserId == userId)
            .LoadWith(ci => ci.Product)
            .ToList();
    }

    public bool Exists(string userId, string productId)
    {
        return dc.GetTable<CartItem>()
            .Any(ci => ci.UserId == userId && ci.ProductId == productId);
    }
}