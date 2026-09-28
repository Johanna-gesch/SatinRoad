using Infra.Entities;
using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class MyDataConnection(DataOptions<MyDataConnection> options) : DataConnection(options.Options)
{
    public ITable<Product> Products => this.GetTable<Product>();
    public ITable<Category> Categories => this.GetTable<Category>();
    public ITable<User> Users => this.GetTable<User>();
}
