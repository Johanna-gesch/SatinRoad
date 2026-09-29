using Infra.Entities;
using Service;
using Service.DTOs.CategoryDTOs;
using Tests.Stubs;

namespace Tests.CategoryServiceTests;

public class CreateCategoryServiceTests
{
    [Fact]
    public void CreateCategory_InsertsCategoryCorrectly()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var service = new CategoryService(stub);

        var dto = new CreateCategoryRequestDto
        {
            CategoryName = "Drugs"
        };
        
        //Act
        service.CreateCategory(dto);
        
        //Assert
        Assert.NotNull(stub.InsertedCategory);
        Assert.Equal("Drugs", stub.InsertedCategory.CategoryName);
        Assert.False((string.IsNullOrWhiteSpace(stub.InsertedCategory.CategoryId)));
    }

    [Fact]
    public void GetAll_ReturnsAllCategories()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var service = new CategoryService(stub);
        
        stub.Categories.Add(new Category { CategoryId = "1", CategoryName = "Drugs"});
        stub.Categories.Add(new Category {CategoryId = "2", CategoryName = "Weapons"});
        
        //Act
        var result = service.GetAll();
        
        //Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.CategoryName == "Drugs");
        Assert.Contains(result, c => c.CategoryName == "Weapons");
    }
}