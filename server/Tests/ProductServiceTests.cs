using Infra.Entities;
using Service;
using Service.DTOs.ProductDTOs;

namespace Tests;

public class ProductServiceTests
{
    [Fact]
    public void CreateProduct_InsertToRepository()
    {
        //Arrange
        var repoStub = new ProductRepositoryStub();
        var service = new ProductService(repoStub);

        var dto = new CreateProductDto
        {
            ProductName = "Kidneys"
        };

        //Act
        service.Insert(dto);

        //Assert
        Assert.NotNull(repoStub.InsertedProduct);
        Assert.Equal("Kidneys", repoStub.InsertedProduct.ProductName);
        Assert.False(string.IsNullOrEmpty(repoStub.InsertedProduct.ProductId));
    }

    [Fact]
    public void UpdateProduct_MakeSureTheRightNameIsSaved()
    {
        //Arrange
        var existingProduct = new Product
        {
            ProductId = "1",
            ProductName = "Old name"
        };

        var repoStub = new ProductRepositoryStub
        {
            ExistingProduct = existingProduct
        };

        var service = new ProductService(repoStub);

        var dto = new UpdateProductDto
        {
            ProductId = "1",
            ProductName = "New name"
        };

        //Act
        service.Update(dto);

        //Assert
        Assert.Equal("New name", existingProduct.ProductName);
    }
}