using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using Infra.Repositories;
using Infra.Repositories.Interfaces;
using Service.DTOs.CartDTOs;
using Service.DTOs.ProductDTOs;
using ValidationException = Infra.ValidationException;

namespace Service;

public class CartService(
    ICartItemRepository cartItemRepository,
    IProductRepository productRepository,
    IUserRepository userRepository,
    IRandom rnd,
    IClock clock
)
{
    public void AddToCart(string userId, string productId, int quantity = 1)
    {
        if (quantity < 1)
            throw new ValidationException("Quantity must be at least 1");
        
        var product = productRepository.GetById(productId)
                      ?? throw new ValidationException("Product not found");
        
        var existing = cartItemRepository.GetCartItem(userId, productId);
        var newQuantity = (existing?.Quantity ?? 0) + quantity;

        if (newQuantity > product.QuantityAvailable)
            throw new ValidationException("Out of stock");
        
        
        if (existing == null)
            cartItemRepository.Add(userId, productId, quantity);
        else
            cartItemRepository.UpdateQuantity(userId, productId, newQuantity);
        
    }
    

    public void UpdateQuantity(string userId, string productId, int quantity)
    {
        var product = productRepository.GetById(productId)
                      ?? throw new ValidationException("Product not found");
        if (quantity <= 0)
        {
            cartItemRepository.Remove(userId, productId);
            return;
        }
        
        if (quantity > product.QuantityAvailable)
            throw new ValidationException("Not enough stock");
        

        var existing = cartItemRepository.GetCartItem(userId, productId);

        if (existing == null)
            throw new ValidationException("Item not in cart");
        
        cartItemRepository.UpdateQuantity(userId, productId, quantity);
    }

    public void RemoveFromCart(string userId, string productId)
    {
        cartItemRepository.Remove(userId, productId);
    }

    public List<CartItem> GetCart(string userId)
    {
        return cartItemRepository.GetCartForUser(userId);
    }

    public BuyResultDto Buy(string userId)
    {
        var cart = cartItemRepository.GetCartForUser(userId);

        // Validation
        if (cart.Count == 0)
            throw new ValidationException("Cart is empty");

        foreach (var cartItem in cart)
        {
            var product = cartItem.Product;

            if (cartItem.Quantity > product.QuantityAvailable)
                throw new ValidationException(
                    $"Not enough stock for {product.ProductName}");
        }

        // Police raid
        if (rnd.Next(1, 101) == 1)
        {
            return PoliceRaid(cart);
        }
        
        // Buy all products
        foreach (var cartItem in cart)
        {
            var product = cartItem.Product;

            product.QuantityAvailable -= cartItem.Quantity;
            product.QuantitySold += cartItem.Quantity;

            if (product.FirstBoughtAt == null)
                product.FirstBoughtAt = clock.UtcNow;

            product.LastBoughtAt = clock.UtcNow;

            productRepository.Update(product);
        }
        
        var purchasedProductNames = cart
            .Select(item => item.Product.ProductName)
            .ToList();

        foreach (var cartItem in cart)
        {
            cartItemRepository.Remove(userId, cartItem.ProductId);
        }

        return new BuyResultDto
        {
            PoliceRaid = false,
            PurchasedProductNames = purchasedProductNames
        };
    }

    private BuyResultDto PoliceRaid(List<CartItem> cart)
    {
        var vendorIds = cart
            .Select(item => item.Product.VendorUserId)
            .Distinct()
            .ToList();

        try
        {
            var deletedVendorUserIds = new List<string>();
            var deletedVendorNames = new List<string>();

            foreach (var vendorId in vendorIds)
            {
                var vendor = userRepository.GetById(vendorId);
                if (vendor == null) continue;

                deletedVendorUserIds.Add(vendor.UserId);
                deletedVendorNames.Add(vendor.UserName);

                var vendorProducts = productRepository
                    .GetByVendorUserId(vendor.UserId)
                    .ToList();

                foreach (var product in vendorProducts)
                {
                    productRepository.Delete(product);
                }

                userRepository.Delete(vendor);
            }

            return new BuyResultDto
            {
                PoliceRaid = true,
                DeletedVendorUserIds = deletedVendorUserIds,
                DeletedVendorNames = deletedVendorNames
            };
        }
        catch
        {
            throw new ConflictException("Police raid failed");
        }
    }

    public PriceResultDto GetCartPrice(string userId)
    {
        var cart = cartItemRepository.GetCartForUser(userId);
        
        // Check if minimum 1 vendor has more than 10 products in the cart
        var hasDiscount = cart
            .GroupBy(item => item.Product.VendorUserId)
            .Any(vendorItems =>
                vendorItems.Sum(item => item.Quantity) > 10);

        // Calculate normal total price
        decimal totalPrice = cart.Sum(item =>
            item.Product.Price * item.Quantity);

        decimal discountAmount = 0;

        if (hasDiscount)
        {
            discountAmount = totalPrice * 0.20m;
        }

        var finalPrice = totalPrice - discountAmount;

        return new PriceResultDto
        {
            TotalPrice = totalPrice,
            DiscountAmount = discountAmount,
            FinalPrice = finalPrice
        };
    }
}