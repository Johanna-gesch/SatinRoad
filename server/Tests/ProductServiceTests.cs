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
}