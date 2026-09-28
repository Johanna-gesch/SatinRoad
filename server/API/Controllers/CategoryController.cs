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
}