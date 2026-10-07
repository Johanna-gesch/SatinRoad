using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.CategoryServiceTests;

public class GetAllCategoriesTests
{
    [Fact]
    public void GetAll_ReturnsAllCategories()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var productRepo = new ProductRepositoryStub();
        var service = new CategoryService(stub, productCategoryStub, productRepo);
        
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