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
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new CategoryService(stub, productCategoryStub);

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
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new CategoryService(stub, productCategoryStub);
        
        stub.Categories.Add(new Category { CategoryId = "1", CategoryName = "Drugs"});
        stub.Categories.Add(new Category {CategoryId = "2", CategoryName = "Weapons"});
        
        //Act
        var result = service.GetAll();
        
        //Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.CategoryName == "Drugs");
        Assert.Contains(result, c => c.CategoryName == "Weapons");
    }

    [Fact]
    public void GetById_ReturnsCorrectCategory()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new CategoryService(stub, productCategoryStub);
        
        stub.Categories.Add(new Category { CategoryId = "1", CategoryName = "Drugs"});

        //Act
        var result = service.GetById("1");
        
        //Assert
        Assert.NotNull(result);
        Assert.Equal("Drugs", result.CategoryName);
    }

    [Fact]
    public void UpdateCategory_UpdatesCorrectly()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new CategoryService(stub, productCategoryStub);
        
        stub.Categories.Add(new Category { CategoryId = "1", CategoryName = "Drugs"});
        stub.Categories.Add(new Category { CategoryId = "2", CategoryName = "Jewelry"});

        var dto = new UpdateCategoryRequestDto
        {
            CategoryIdForLookup = "1",
            NewCategoryName = "Weapons"
        };
        
        //Act
        service.UpdateCategory(dto);
        
        //Assert
        var updated = stub.Categories.First(c => c.CategoryId == "1");
        Assert.Equal("Weapons", updated.CategoryName);

        var untouched = stub.Categories.First(c => c.CategoryId == "2");
        Assert.Equal("Jewelry", untouched.CategoryName);
        
        Assert.Equal("Weapons", stub.UpdatedCategory.CategoryName);
    }
}