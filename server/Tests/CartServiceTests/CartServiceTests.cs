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
        var service = new CartService(cartRepo, productRepo);

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
        var service = new CartService(new CartItemRepositoryStub(), productRepo);

        Assert.Throws<ValidationException>(() => service.AddToCart("u1", "missing"));
    }

    [Fact]
    public void AddToCart_IncreasesQuantity_WhenAlreadyInCart()
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = ProductWithStock() };
        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1", 1);
        var service = new CartService(cartRepo, productRepo);

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
        var service = new CartService(cartRepo, productRepo);

        Assert.Throws<ValidationException>(() => service.AddToCart("u1", "p1", 2));
        Assert.Equal(2, cartRepo.Store[0].Quantity); // uændret
    }
 
    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void AddToCart_Throws_WhenQuantityIsInvalid(int quantity)
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = ProductWithStock() };
        var service = new CartService(new CartItemRepositoryStub(), productRepo);

        Assert.Throws<ValidationException>(() => service.AddToCart("u1", "p1", quantity));
    }
    
    [Fact]
    public void RemoveFromCart_RemovesItem()
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = ProductWithStock() };
        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1", 1);
        var service = new CartService(cartRepo, productRepo);

        service.RemoveFromCart("u1", "p1");

        Assert.Empty(cartRepo.Store);
    }

    [Fact]
    public void GetCart_ReturnsCorrectItems()
    {
        var productRepo = new ProductRepositoryStub { ExistingProduct = ProductWithStock() };
        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1", 1);
        cartRepo.Add("u1", "p2", 1);
        cartRepo.Add("u2", "p3", 1);
        var service = new CartService(cartRepo, productRepo);

        var cart = service.GetCart("u1");

        Assert.Equal(2, cart.Count);
    }
}