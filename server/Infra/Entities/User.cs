using LinqToDB.Mapping;

namespace Infra.Entities;

public class User
{
    [PrimaryKey] public string UserId { get; set; } = "";
    [Column] public string UserName { get; set; } = "";
    
    [Column] public bool IsAdmin { get; set; } = false;
}