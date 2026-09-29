using Infra;
using Infra.Entities;
using Service;
using Service.DTOs.ProductDTOs;

namespace Tests;

public class UpdateProductTests
{
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
        Assert.NotNull(repoStub.UpdatedProduct);
        Assert.Equal("New name", repoStub.UpdatedProduct.ProductName);
    }
    
    [Fact]
    public void UpdateProduct_DoesNotChangeName_WhenNameIsEmpty()
    {
        // Arrange
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
            ProductName = ""
        };

        // Act
        service.Update(dto);

        // Assert
        Assert.Equal("Old name", repoStub.ExistingProduct.ProductName);
    }
    
    [Fact]
    public void UpdateProduct_ThrowsValidationException_WhenProductDoesNotExist()
    {
        // Arrange
        var repoStub = new ProductRepositoryStub
        {
            ExistingProduct = null
        };

        var service = new ProductService(repoStub);

        var dto = new UpdateProductDto
        {
            ProductId = "does-not-exist",
            ProductName = "New name"
        };

        // Act & Assert
        var exception = Assert.Throws<ValidationException>(
            () => service.Update(dto)
        );

        Assert.Equal("Product not found", exception.Message);
    }
    
}