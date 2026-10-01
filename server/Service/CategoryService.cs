using Infra;
using Infra.Entities;
using Infra.Repositories;
using Service.DTOs.CategoryDTOs;

namespace Service;

public class CategoryService
{
    private readonly IRepository<Category> categories;
    private readonly IProductCategoryRepository productCategories;

    public CategoryService(
        IRepository<Category> categories,
        IProductCategoryRepository productCategories)
    {
        this.categories = categories;
        this.productCategories = productCategories;
    }
    
    public void CreateCategory(CreateCategoryRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CategoryName))
            throw new ValidationException("Category name is required");
        
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

    public void DeleteCategory(string categoryId)
    {
        var category = categories.GetById(categoryId)
                       ?? throw new ValidationException("Category doesn't exist");
        productCategories.RemoveByCategory(categoryId);
        categories.Delete(category);
    }
}