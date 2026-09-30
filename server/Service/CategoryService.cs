using Infra;
using Infra.Entities;
using Infra.Repositories;
using Service.DTOs.CategoryDTOs;

namespace Service;

public class CategoryService
{
    private readonly IRepository<Category> categories;
    private readonly IProductRepository products;

    public CategoryService(
        IRepository<Category> categories,
        IProductRepository products)
    {
        this.categories = categories;
        this.products = products;
    }
    
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

    public void DeleteCategory(string categoryId)
    {
        products.DeleteByCategoryId(categoryId);

        var category = categories.GetById(categoryId)
                       ?? throw new ValidationException("Category doesn't exist");
        categories.Delete(category);
    }
}