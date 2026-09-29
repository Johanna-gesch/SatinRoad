using Infra;
using Infra.Entities;
using Service;

namespace Tests;

public class DeleteProductTests
{
    [Fact]
    public void DeleteProduct_DeletesTheCorrectProduct()
    {
        // Arrange
        var existingProduct = new Product
        {
            ProductId = "1",
            ProductName = "Test product"
        };

        var repoStub = new ProductRepositoryStub
        {
            ExistingProduct = existingProduct
        };

        var service = new ProductService(repoStub);

        // Act
        service.Delete("1");

        // Assert
        Assert.Equal(existingProduct, repoStub.DeletedProduct);
    }
    
    [Fact]
    public void DeleteProduct_ThrowsValidationException_WhenProductDoesNotExist()
    {
        // Arrange
        var repoStub = new ProductRepositoryStub
        {
            ExistingProduct = null
        };

        var service = new ProductService(repoStub);

        // Act & Assert
        var exception = Assert.Throws<ValidationException>(
            () => service.Delete("does-not-exist")
        );

        Assert.Equal("Product not found", exception.Message);
    }
}