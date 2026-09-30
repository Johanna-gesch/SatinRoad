using LinqToDB.Mapping;

namespace Infra.Entities;

public class Product
{
    [PrimaryKey] public string ProductId { get; set; } = "";
    [Column] public string ProductName { get; set; } = "";
    [Column] public bool IsBought { get; set; } = false;
    [Column] public DateTime BoughtAt { get; set; }
    /*[Column, NotNull] 
    public string CategoryId { get; set; } = "";

    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(Category.CategoryId))]
    public Category Category { get; set; }*/
}