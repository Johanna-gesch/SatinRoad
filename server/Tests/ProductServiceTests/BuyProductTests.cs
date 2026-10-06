using Infra;
using Infra.Entities;
using Infra.Repositories;
using Service;
using Service.DTOs.ProductDTOs;
using Tests.Stubs;

namespace Tests;

public class BuyProductTests
{

    [Fact]
    public void BuyProduct_NoPolice_UpdatesQuantityAndTimestamps()
    {
        //Arrange
        var product = new Product 
        {
            ProductId = "1",
            ProductName = "Test",
            VendorUserId = "Bob",
            QuantityAvailable = 10,
            QuantitySold = 0,
            
        };

        var repoStub = new ProductRepositoryStub
        {
            ExistingProduct = product
        };
        
        var rndStub = new RandomStub
        {
            Value = 50
        };

        var clockStub = new ClockStub
        {
            UtcNow = new DateTime(2026, 10, 4, 12, 0, 0)
        };
        
        var userRepo = new UserRepositoryStub();
        var productCategoryRepo = new ProductCategoryRepositoryStub();
        
        var service = new ProductService(repoStub, productCategoryRepo, userRepo, rndStub, clockStub);

        var dto = new BuyProductDto
        {
            ProductId = product.ProductId,
            Quantity = 1
        };
        
        // Act
        var result = service.Buy(dto);
        
        //Assert
        Assert.False(result.PoliceRaid);
        
        Assert.Equal(9, product.QuantityAvailable);
        Assert.Equal(1, product.QuantitySold);
        Assert.Equal(clockStub.UtcNow, product.FirstBoughtAt);
        Assert.Equal(clockStub.UtcNow, product.LastBoughtAt);
        
        Assert.Same(product, repoStub.UpdatedProduct);
    }

    [Fact]
    public void BuyProduct_PoliceRaid_DeletesVendorAndVendorsProducts_DoesntUpdate()
    {
        //Arrange
        var vendor = new User
        {
            UserId = "1",
            UserName = "Bob"
        };

        var product = new Product
        {
            ProductId = "1",
            ProductName = "Kidneys",
            VendorUserId = "1",
            QuantityAvailable = 10,
            QuantitySold = 0,
        };
        
        var product2 = new Product
        {
            ProductId = "2",
            ProductName = "Stolen Necklace",
            VendorUserId = "1",
            QuantityAvailable = 5,
            QuantitySold = 0,
        };
        
        var repoStub = new ProductRepositoryStub
        {
            ExistingProduct = product,
            VendorProducts = new List<Product>
            {
                product,
                product2
            }
        };

        var userRepo = new UserRepositoryStub
        {
            ExistingUser = vendor
        };
        
        var rndStub = new RandomStub
        {
            Value = 1
        };

        var clockStub = new ClockStub
        {
            UtcNow = new DateTime(2026, 10, 4, 12, 0, 0)
        };
        var productCategoryRepo = new ProductCategoryRepositoryStub();
        
        var service = new ProductService(repoStub, productCategoryRepo, userRepo, rndStub, clockStub);

        var dto = new BuyProductDto
        {
            ProductId = product.ProductId,
            Quantity = 1
        };
        
        //Act
        var result = service.Buy(dto);
        
        // Assert
        Assert.True(result.PoliceRaid);
        Assert.Equal("1", result.DeletedVendorUserId);
        Assert.Equal("Bob", result.DeletedVendorName);

        Assert.Contains("Kidneys", result.DeletedProductNames);
        Assert.Contains("Stolen Necklace", result.DeletedProductNames);

        Assert.Same(vendor, userRepo.DeletedUser);

        
        Assert.Equal(10, product.QuantityAvailable);
        Assert.Equal(0, product.QuantitySold);
        Assert.Null(product.FirstBoughtAt);
        Assert.Null(product.LastBoughtAt);
        Assert.Null(repoStub.UpdatedProduct);
    }

    [Fact]
    public void BuyProduct_Throws_WhenQuantityIsZero()
    {
        var product = new Product
        {
            ProductId = "1",
            QuantityAvailable = 10
        };
        var repoStub = new ProductRepositoryStub { ExistingProduct = product };
        var service = new ProductService(
            repoStub,
            new ProductCategoryRepositoryStub(),
            new UserRepositoryStub(),
            new RandomStub { Value = 50 },
            new ClockStub { UtcNow = DateTime.UtcNow });

        var dto = new BuyProductDto { ProductId = "1", Quantity = 0 };
        
        var ex = Assert.Throws<ValidationException>(() => service.Buy(dto));
        Assert.Equal("Quantity must be at least 1", ex.Message);
    }
    
    [Fact]
    public void BuyProduct_Throws_WhenNotEnoughStock()
    {
        var product = new Product
        {
            ProductId = "1",
            QuantityAvailable = 10
        };
        var repoStub = new ProductRepositoryStub { ExistingProduct = product };
        var service = new ProductService(
            repoStub,
            new ProductCategoryRepositoryStub(),
            new UserRepositoryStub(),
            new RandomStub { Value = 50 },
            new ClockStub { UtcNow = DateTime.UtcNow });

        var dto = new BuyProductDto { ProductId = "1", Quantity = 15 };

        var ex = Assert.Throws<ValidationException>(() => service.Buy(dto));
        Assert.Equal("Not enough stock available", ex.Message);
    }
    
}