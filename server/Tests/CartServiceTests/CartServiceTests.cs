using Infra;
using Infra.Entities;
using Service;
using Tests.Stubs;
using ValidationException = System.ComponentModel.DataAnnotations.ValidationException;

namespace Tests.CartServiceTests;

public class CartServiceTests
{
    [Fact]
    public void AddToCart_AddsItem_WhenValid()
    {
        var productRepo = new ProductRepositoryStub
        {
            ExistingProduct = new Product() { ProductId = "p1" }
        };

        var cartRepo = new CartItemRepositoryStub();
        var service = new CartService(cartRepo, productRepo);
        
        service.AddToCart("u1", "p1");

        Assert.Single(cartRepo.Store);
        Assert.Equal("u1", cartRepo.Store[0].UserId);
        Assert.Equal("p1", cartRepo.Store[0].ProductId);
    }

    [Fact]
    public void AddToCart_Throws_WhenProductDoesNotExist()
    {
        var productRepo = new ProductRepositoryStub
        {
            ExistingProduct = null
        };

        var cartRepo = new CartItemRepositoryStub();
        var service = new CartService(cartRepo, productRepo);

        Assert.Throws<Infra.ValidationException>(() => service.AddToCart("u1", "missing")
        );
    }

    [Fact]
    public void AddToCart_Throws_WhenAlreadyInCart()
    {
        var productRepo = new ProductRepositoryStub
        {
            ExistingProduct = new Product { ProductId = "p1" }
        };

        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1");

        var service = new CartService(cartRepo, productRepo);

        Assert.Throws<Infra.ValidationException>(() => service.AddToCart("u1", "p1")
        );
    }
 
    [Fact]
    public void RemoveFromCart_RemovesItem()
    {
        var productRepo = new ProductRepositoryStub
        {
            ExistingProduct = new Product { ProductId = "p1" }
        };

        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1");

        var service = new CartService(cartRepo, productRepo);
        
        service.RemoveFromCart("u1", "p1");
        
        Assert.Empty(cartRepo.Store);
    }

    [Fact]
    public void GetCart_ReturnsCorrectItems()
    {
        var productRepo = new ProductRepositoryStub
        {
            ExistingProduct = new Product { ProductId = "p1" }
        };

        var cartRepo = new CartItemRepositoryStub();
        cartRepo.Add("u1", "p1");
        cartRepo.Add("u1", "p2");
        cartRepo.Add("u2", "p3");

        var service = new CartService(cartRepo, productRepo);

        var cart = service.GetCart("u1");
        
        Assert.Equal(2, cart.Count);
    }
}