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
        return dc.GetTable<Category>()
            .FirstOrDefault(c => c.CategoryId == id);
    }

    public void Update(Category entity)
    {
        dc.Update(entity);
    }

    public void Delete(Category entity)
    {
        dc.Delete(entity);
    }

    public List<Category> GetAll()
    {
        return dc.GetTable<Category>().ToList();
    }
}