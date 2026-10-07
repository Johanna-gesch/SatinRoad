using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.CartServiceTests;

public class BuyTests
{
    [Fact]
    public void BuyCart_NoPolice_UpdatesQuantityAndTimestamps()
    {
        // Arrange
        var product = new Product
        {
            ProductId = "1",
            ProductName = "Test product",
            VendorUserId = "vendor1",
            QuantityAvailable = 10,
            QuantitySold = 0,
            Price = 100
        };

        var cartItem = new CartItem
        {
            CartItemId = "cart1",
            UserId = "user1",
            ProductId = product.ProductId,
            Quantity = 1,
            Product = product
        };

        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Store.Add(cartItem);

        var productRepo = new ProductRepositoryStub
        {
            ExistingProduct = product
        };

        var userRepo = new UserRepositoryStub();

        var rndStub = new RandomStub
        {
            Value = 50
        };

        var clockStub = new ClockStub
        {
            UtcNow = new DateTime(2026, 10, 4, 12, 0, 0)
        };

        var service = new CartService(
            cartRepo,
            productRepo,
            userRepo,
            rndStub,
            clockStub
        );

        // Act
        var result = service.Buy("user1");

        // Assert
        Assert.False(result.PoliceRaid);

        Assert.Equal(9, product.QuantityAvailable);
        Assert.Equal(1, product.QuantitySold);

        Assert.Equal(clockStub.UtcNow, product.FirstBoughtAt);
        Assert.Equal(clockStub.UtcNow, product.LastBoughtAt);

        Assert.Same(product, productRepo.UpdatedProduct);

        Assert.Contains("Test product", result.PurchasedProductNames);

        Assert.Empty(cartRepo.Store);
    }
    
    [Fact]
    public void BuyCart_PoliceRaid_DeletesVendorAndProducts_DoesNotBuy()
    {
        // Arrange
        var vendor = new User
        {
            UserId = "vendor1",
            UserName = "Bob"
        };

        var product = new Product
        {
            ProductId = "1",
            ProductName = "Test product",
            VendorUserId = "vendor1",
            QuantityAvailable = 10,
            QuantitySold = 0
        };

        var product2 = new Product
        {
            ProductId = "2",
            ProductName = "Another product",
            VendorUserId = "vendor1",
            QuantityAvailable = 5,
            QuantitySold = 0
        };

        var cartItem = new CartItem
        {
            CartItemId = "cart1",
            UserId = "user1",
            ProductId = product.ProductId,
            Quantity = 1,
            Product = product
        };

        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Store.Add(cartItem);

        var productRepo = new ProductRepositoryStub
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

        var service = new CartService(
            cartRepo,
            productRepo,
            userRepo,
            rndStub,
            clockStub
        );
        // Act
        var result = service.Buy("user1");

        // Assert
        Assert.True(result.PoliceRaid);

        Assert.Contains("vendor1", result.DeletedVendorUserIds);
        Assert.Contains("Bob", result.DeletedVendorNames);

        Assert.Same(vendor, userRepo.DeletedUser);

        Assert.Equal(10, product.QuantityAvailable);
        Assert.Equal(0, product.QuantitySold);
        Assert.Null(product.FirstBoughtAt);
        Assert.Null(product.LastBoughtAt);

        Assert.Null(productRepo.UpdatedProduct);
    }
}