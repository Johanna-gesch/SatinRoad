using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTOs.CategoryDTOs;

namespace API.Controllers;

public class CategoryController(CategoryService service) : ControllerBase
{
    [HttpPost(nameof(CreateCategory))]
    public void CreateCategory([FromBody] CreateCategoryRequestDto dto)
    {
        service.CreateCategory(dto);
    }

    [HttpGet(nameof(GetAllCategories))]
    public List<Category> GetAllCategories()
    {
        return service.GetAll();
    }

    [HttpGet(nameof(GetById))]
    public Category? GetById(string id)
    {
        return service.GetById(id);
    }

    [HttpPut(nameof(UpdateCategory))]
    public void UpdateCategory([FromBody] UpdateCategoryRequestDto dto)
    {
        service.UpdateCategory(dto);
    }

    [HttpDelete(nameof(DeleteCategory))]
    public void DeleteCategory([FromQuery] string categoryId)
    {
        service.DeleteCategory(categoryId);
    }
}