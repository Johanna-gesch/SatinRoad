using System.Runtime.InteropServices.ComTypes;
using Infra.Entities;
using LinqToDB;

namespace Infra.Repositories;

public class CartItemRepository(MyDataConnection dc) : ICartItemRepository
{
    public CartItem? GetCartItem(string userId, string productId)
    {
        return dc.GetTable<CartItem>()
            .FirstOrDefault(ci => ci.UserId == userId && ci.ProductId == productId);
    }
    
    public void Add(string userId, string productid, int quantity = 1)
    {
        dc.Insert(new CartItem
        {
            CartItemId = Guid.NewGuid().ToString(),
            UserId = userId,
            ProductId = productid,
            Quantity = quantity
        });
    }

    public void UpdateQuantity(string userId, string productId, int quantity)
    {
        dc.GetTable<CartItem>()
            .Where(ci => ci.UserId == userId && ci.ProductId == productId)
            .Set(ci => ci.Quantity, quantity)
            .Update();
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