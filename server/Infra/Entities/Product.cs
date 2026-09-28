using LinqToDB.Mapping;

namespace Infra.Entities;

public class Product
{
    [PrimaryKey] public string ProductId { get; set; } = "";
    [Column] public string ProductName { get; set; } = "";
}