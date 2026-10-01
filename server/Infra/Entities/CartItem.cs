using LinqToDB.Mapping;

namespace Infra.Entities;

public class CartItem
{
    [PrimaryKey] public string CartItemId { get; set; } = "";
    [Column] public string UserId { get; set; } = "";
    [Column] public string ProductId { get; set; } = "";

    [Association(ThisKey = nameof(UserId), OtherKey = nameof(User.UserId))]
    public User User { get; set; }

    [Association(ThisKey = nameof(ProductId), OtherKey = nameof(Product.ProductId))]
    public Product Product { get; set; }
}