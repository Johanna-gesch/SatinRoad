using Infra;
using Infra.Entities;
using Infra.Repositories;
using Service.DTOs.UserDTOs;
using ValidationException = Infra.ValidationException;

namespace Service;

public class UserService
{
    private readonly IUserRepository userRepo;
    private readonly IProductCategoryRepository productCategoryRepo;

    public UserService(
        IProductCategoryRepository productCategoryRepo,
        IUserRepository userRepo)
    {
        this.productCategoryRepo = productCategoryRepo;
        this.userRepo = userRepo;
    }
    
    public void Insert(CreateUserDto dto)
    {
        var newUser = new User
        {
            UserId = Guid.NewGuid().ToString(),
            UserName = dto.UserName,
        };
        userRepo.Insert(newUser);
    }

    public User GetById(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ValidationException("Id can't be empty");
        return userRepo.GetById(id)
               ?? throw new NotFoundException($"User whit this id '{id}' is not found");
    }

    public void Update(UpdateUserDto dto)
    {
        var user = userRepo.GetById(dto.UserId)
                   ?? throw new ValidationException("User not found");

        if (!string.IsNullOrWhiteSpace(dto.UserName))
            user.UserName = dto.UserName;
        
        userRepo.Update(user);
    }

    public void Delete(string id)
    {
        var user = userRepo.GetById(id)
                   ?? throw new ValidationException("User not found");
        
        userRepo.Delete(user);
    }
    
    public List<User> GetAll()
    {
        return userRepo.GetAll();
    }

    public User GetIdWithProducts(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ValidationException("Id can't be empty");

        var user = userRepo.GetByIdWithProducts(id) ??
                   throw new NotFoundException($"$User with this id '{id}'  is not found");
        foreach (var product in user.Products)
        {
            product.Categories =
                productCategoryRepo.GetCategoriesForProduct(product.ProductId);
        }
        return user;
    }

    public UserReturnDto GetTopSellers()
    {
        List<string> topsellers = new List<string>();
        
        foreach (User user in userRepo.GetAll())
        {
            var userWProducts = userRepo.GetByIdWithProducts(user.UserId);
            
            if (userWProducts.Products.Sum(p => p.QuantitySold) > 99)
            {
                topsellers.Add(user.UserName);
            }
        }

        return new UserReturnDto
        {
            TopSellerNames = topsellers
        };
    }
}