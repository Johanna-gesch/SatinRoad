using LinqToDB.Mapping;

namespace Infra.Entities;

public class User
{
    [PrimaryKey] public string UserId { get; set; } = "";
    [Column] public string UserName { get; set; } = "";
    [Column] public bool IsAdmin { get; set; }
    
    [Association(ThisKey = nameof(UserId), OtherKey = nameof(Product.VendorUserId))]
    public List<Product> Products { get; set; } = new();
    
    [Association(ThisKey = nameof(UserId), OtherKey = nameof(CartItem.UserId))]
    public List<CartItem> Cart { get; set; } = new();

}