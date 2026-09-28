using Infra;
using Infra.Entities;

namespace Tests.Stubs;

public class CategoryRepositoryStub : IRepository<Category>
{
    public Category InsertedCategory;
    
    public void Insert(Category entity)
    {
        InsertedCategory = entity;
    }

    public Category? GetById(string id)
    {
        throw new NotImplementedException();
    }

    public void Update(Category entity)
    {
        throw new NotImplementedException();
    }

    public void Delete(string id)
    {
        throw new NotImplementedException();
    }

    public List<Category> GetAll()
    {
        throw new NotImplementedException();
    }
}