using Infra;
using Infra.Entities;
using Service;
using Tests.Stubs;

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
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var userRepoStub = new UserRepositoryStub();
        var rndStub = new RandomStub();
        var clockStub = new ClockStub();

        var service = new ProductService(repoStub, productCategoryStub, userRepoStub, rndStub, clockStub);

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

        var productCategoryStub = new ProductCategoryRepositoryStub();
        var userRepoStub = new UserRepositoryStub();
        var rndStub = new RandomStub();
        var clockStub = new ClockStub();

        var service = new ProductService(repoStub, productCategoryStub, userRepoStub, rndStub, clockStub);

        // Act & Assert
        var exception = Assert.Throws<ValidationException>(
            () => service.Delete("does-not-exist")
        );

        Assert.Equal("Product not found", exception.Message);
    }
}