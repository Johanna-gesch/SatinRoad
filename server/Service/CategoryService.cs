using Infra;
using Infra.Entities;
using Service.DTOs.CategoryDTOs;

namespace Service;

public class CategoryService(IRepository<Category> categories)
{
    public void CreateCategory(CreateCategoryRequestDto dto)
    {
        var category = new Category
        {
            CategoryId = Guid.NewGuid().ToString(),
            CategoryName = dto.CategoryName
        };
        
        categories.Insert(category);
    }

    public List<Category> GetAll()
    {
        return categories.GetAll();
    }

    public Category? GetById(string id)
    {
        return categories.GetById(id);
    }

    public void UpdateCategory(UpdateCategoryRequestDto dto)
    {
        var category = categories.GetById(dto.CategoryIdForLookup)
                       ?? throw new ValidationException("Category doesn't exist");
        if (dto.NewCategoryName is not null)
            category.CategoryName = dto.NewCategoryName;
        
        categories.Update(category);
    }
}