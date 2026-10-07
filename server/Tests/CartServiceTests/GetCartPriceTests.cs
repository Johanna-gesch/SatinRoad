using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.CartServiceTests;

public class GetCartPriceTests
{
    [Theory]
    [InlineData(2, 100, 200, 0, 200)]       // 2 produkter → ingen discount
    [InlineData(10, 100, 1000, 0, 1000)]    // Præcis 10 → ingen discount
    [InlineData(11, 100, 1100, 220, 880)]   // 11 fra samme vendor → 20% discount
    public void GetCartPrice_ReturnsCorrectPrice(
        int quantity,
        decimal price,
        decimal expectedTotal,
        decimal expectedDiscount,
        decimal expectedFinal)
    {
        // Arrange
        var product = new Product
        {
            ProductId = "1",
            ProductName = "Test product",
            VendorUserId = "vendor1",
            Price = price,
            QuantityAvailable = 20
        };

        var cartItem = new CartItem
        {
            CartItemId = "cart1",
            UserId = "user1",
            ProductId = product.ProductId,
            Quantity = quantity,
            Product = product
        };

        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Store.Add(cartItem);

        var service = new CartService(
            cartRepo,
            new ProductRepositoryStub(),
            new UserRepositoryStub(),
            new RandomStub(),
            new ClockStub()
        );

        // Act
        var result = service.GetCartPrice("user1");

        // Assert
        Assert.Equal(expectedTotal, result.TotalPrice);
        Assert.Equal(expectedDiscount, result.DiscountAmount);
        Assert.Equal(expectedFinal, result.FinalPrice);
    }
    
    [Fact]
    public void GetCartPrice_NoDiscount_WhenProductsAreSplitBetweenVendors()
    {
        // Arrange
        var product1 = new Product
        {
            ProductId = "1",
            ProductName = "Product 1",
            VendorUserId = "vendor1",
            Price = 100
        };

        var product2 = new Product
        {
            ProductId = "2",
            ProductName = "Product 2",
            VendorUserId = "vendor2",
            Price = 100
        };

        var cartRepo = new CartItemRepositoryStub();

        cartRepo.Store.Add(new CartItem
        {
            CartItemId = "cart1",
            UserId = "user1",
            ProductId = product1.ProductId,
            Quantity = 6,
            Product = product1
        });

        cartRepo.Store.Add(new CartItem
        {
            CartItemId = "cart2",
            UserId = "user1",
            ProductId = product2.ProductId,
            Quantity = 5,
            Product = product2
        });

        var service = new CartService(
            cartRepo,
            new ProductRepositoryStub(),
            new UserRepositoryStub(),
            new RandomStub(),
            new ClockStub()
        );

        // Act
        var result = service.GetCartPrice("user1");

        // Assert
        Assert.Equal(1100, result.TotalPrice);
        Assert.Equal(0, result.DiscountAmount);
        Assert.Equal(1100, result.FinalPrice);
    }
}
