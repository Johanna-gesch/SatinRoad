using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.CategoryServiceTests;

public class GetByIdCategoryTests
{
    [Fact]
    public void GetById_ReturnsCorrectCategory()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var productRepo = new ProductRepositoryStub();
        var service = new CategoryService(stub, productCategoryStub, productRepo);
        
        stub.Categories.Add(new Category { CategoryId = "1", CategoryName = "Drugs"});

        //Act
        var result = service.GetById("1");
        
        //Assert
        Assert.NotNull(result);
        Assert.Equal("Drugs", result.CategoryName);
    }
}