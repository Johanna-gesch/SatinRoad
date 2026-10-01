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
            CategoryIds = new List<string> { "cat1" },
            VendorUserId = "vendor1",
            Price = 100,
            Description = "Test product",
            ImageUrl = "https://example.test/image.jpg"
        };

        //Act
        service.Insert(dto);

        //Assert
        Assert.NotNull(repoStub.InsertedProduct);
        Assert.Equal("Kidneys", repoStub.InsertedProduct.ProductName);
        Assert.False(string.IsNullOrEmpty(repoStub.InsertedProduct.ProductId));
        Assert.Equal("vendor1", repoStub.InsertedProduct.VendorUserId);
        Assert.Equal(100, repoStub.InsertedProduct.Price);
        Assert.Equal("Test product", repoStub.InsertedProduct.Description);
        Assert.Equal("https://example.test/image.jpg", repoStub.InsertedProduct.ImageUrl);
    }
    
}