using Infra.Entities;
using LinqToDB;

namespace Infra;

public class CategoryRepository(MyDataConnection dc) : IRepository<Category>
{
    public void Insert(Category entity)
    {
        dc.Insert(entity);
    }

    public Category? GetById(string id)
    {
        throw new NotImplementedException();
    }

    public void Update(Category entity)
    {
        throw new NotImplementedException();
    }

    public void Delete(Category entity)
    {
        throw new NotImplementedException();
    }

    public List<Category> GetAll()
    {
        return dc.GetTable<Category>().ToList();
    }
}