using Infra.Entities;
using Service;
using Service.DTOs.CategoryDTOs;
using Tests.Stubs;

namespace Tests.CategoryServiceTests;

public class UpdateCategoryTests
{
    [Fact]
    public void UpdateCategory_UpdatesCorrectly()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var productRepo = new ProductRepositoryStub();
        var service = new CategoryService(stub, productCategoryStub, productRepo);
        
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