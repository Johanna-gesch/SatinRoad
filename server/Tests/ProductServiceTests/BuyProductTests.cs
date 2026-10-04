using Infra.Entities;
using Service;
using Service.DTOs.ProductDTOs;
using Tests.Stubs;

namespace Tests;

public class BuyProductTests
{

    [Fact]
    public void BuyProduct_NoPolice_SetsIsBoughtToTrueAndTimeBoughtAt()
    {
        //Arrange
        var product = new Product 
        {
            ProductId = "1",
            IsBought = false,
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
            IsBought = product.IsBought,
        };
        
        // Act
        var result = service.Buy(dto);
        
        //Assert
        Assert.False(result.PoliceRaid);
        Assert.True(product.IsBought);
        Assert.NotNull(product.BoughtAt);
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
            IsBought = false,
        };
        
        var product2 = new Product
        {
            ProductId = "2",
            ProductName = "Stolen Necklace",
            VendorUserId = "1",
            IsBought = false,
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
            IsBought = product.IsBought,
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

        // Make sure the normal purchase code was NOT reached
        Assert.False(product.IsBought);
        Assert.Null(product.BoughtAt);
        Assert.Null(repoStub.UpdatedProduct);

    }
    
}