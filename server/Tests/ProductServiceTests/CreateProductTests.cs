using Infra.Entities;
using Service;
using Service.DTOs.ProductDTOs;
using Tests.Stubs;

namespace Tests;

public class CreateProductTests
{
    [Fact]
    public void CreateProduct_InsertToRepository()
    {
        //Arrange
        var repoStub = new ProductRepositoryStub();
        var productCategoryRepo = new ProductCategoryRepositoryStub();
        var service = new ProductService(repoStub, productCategoryRepo);

        var dto = new CreateProductDto
        {
            ProductName = "Kidneys",
            CategoryIds = new List<string> { "cat1 "}
        };

        //Act
        service.Insert(dto);

        //Assert
        Assert.NotNull(repoStub.InsertedProduct);
        Assert.Equal("Kidneys", repoStub.InsertedProduct.ProductName);
        Assert.False(string.IsNullOrEmpty(repoStub.InsertedProduct.ProductId));
    }
    
}