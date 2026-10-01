using Infra;
using Infra.Entities;
using LinqToDB;
using LinqToDB.Data;

public class MySeeder(MyDataConnection dc)
{
    public void Seed()
    {
        dc.CreateTable<Product>(tableOptions: TableOptions.CreateIfNotExists);
        dc.CreateTable<Category>(tableOptions: TableOptions.CreateIfNotExists);
        dc.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);
        dc.CreateTable<ProductCategory>(tableOptions: TableOptions.CreateIfNotExists);
        
        if (dc.Categories.Count() == 0)
            for (int i = 1; i <= 10; i++)
            {
                dc.Insert(new Category
                {
                    CategoryId = Guid.NewGuid().ToString(),
                    CategoryName = $"Category {i}"
                });
            }
        
        if (dc.Users.Count() == 0)
            for (int i = 1; i <= 10; i++)
            {
                dc.Insert(new User
                {
                    UserId = i.ToString(),
                    UserName = $"User {i}",
                    IsAdmin = i == 1
                });
            }

    }
}