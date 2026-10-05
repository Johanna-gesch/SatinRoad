using LinqToDB.Mapping;

namespace Infra.Entities;

public class Product
{
    [PrimaryKey] public string ProductId { get; set; } = "";
    [Column] public string ProductName { get; set; } = "";
    [Column] public decimal Price { get; set; }
    [Column] public string? Description { get; set; }
    [Column] public string? ImageUrl { get; set; }
    [Column] public string VendorUserId { get; set; } = "";
    [Column] public DateTime CreatedAt { get; set; }
    
    [Column] public int QuantityAvailable { get; set; } = 10;
    [Column] public int QuantitySold { get; set; }
    
    [Column] public DateTime? FirstBoughtAt { get; set; }
    [Column] public DateTime? LastBoughtAt { get; set; }

    [NotColumn] public List<Category> Categories { get; set; } = new();
}