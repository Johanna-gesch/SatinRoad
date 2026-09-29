using Infra;
using Infra.Entities;

namespace Tests.Stubs;

public class CategoryRepositoryStub : IRepository<Category>
{
    public Category InsertedCategory;
    public List<Category> Categories { get; set; } = new();
    public Category UpdatedCategory;
    public Category DeletedCategoryId;
    
    public void Insert(Category entity)
    {
        InsertedCategory = entity;
    }

    public Category? GetById(string id)
    {
        return Categories.FirstOrDefault(c => c.CategoryId == id);
    }

    public void Update(Category entity)
    {
        UpdatedCategory = entity;
    }

    public void Delete(Category entity)
    {
        DeletedCategoryId = entity;
    }

    public List<Category> GetAll()
    {
        return Categories;
    }
}