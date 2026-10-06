using Infra;
using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.CartServiceTests;

public class CartServiceTests
{
    private static Product ProductWithStock(int stock = 5) =>
        new() { ProductId = "p1", QuantityAvailable = stock };

    [Fact]
    public void AddToCart_AddsItem_WhenValid()
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = ProductWithStock() };
        var cartRepo = new CartItemRepositoryStub();

        var service = new CartService(
            cartRepo,
            productRepo,
            new UserRepositoryStub(),
            new RandomStub(),
            new ClockStub()
        );

        service.AddToCart("u1", "p1", 2);

        Assert.Single(cartRepo.Store);
        Assert.Equal("u1", cartRepo.Store[0].UserId);
        Assert.Equal("p1", cartRepo.Store[0].ProductId);
        Assert.Equal(2, cartRepo.Store[0].Quantity);
    }

    [Fact]
    public void AddToCart_Throws_WhenProductDoesNotExist()
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = null };

        var service = new CartService(
            new CartItemRepositoryStub(),
            productRepo,
            new UserRepositoryStub(),
            new RandomStub(),
            new ClockStub()
        );

        Assert.Throws<ValidationException>(() => service.AddToCart("u1", "missing"));
    }

    [Fact]
    public void AddToCart_IncreasesQuantity_WhenAlreadyInCart()
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = ProductWithStock() };
        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1", 1);

        var service = new CartService(
            cartRepo,
            productRepo,
            new UserRepositoryStub(),
            new RandomStub(),
            new ClockStub()
        );

        service.AddToCart("u1", "p1", 2);

        Assert.Single(cartRepo.Store);
        Assert.Equal(3, cartRepo.Store[0].Quantity);
    }

    [Fact]
    public void AddToCart_Throws_WhenTotalExceedsStock()
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = ProductWithStock(3) };
        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1", 2);

        var service = new CartService(
            cartRepo,
            productRepo,
            new UserRepositoryStub(),
            new RandomStub(),
            new ClockStub()
        );

        Assert.Throws<ValidationException>(() => service.AddToCart("u1", "p1", 2));
        Assert.Equal(2, cartRepo.Store[0].Quantity);
    }

    
}