using Infra;
using Infra.Entities;
using Infra.Repositories;
using Service.DTOs.UserDTOs;
using ValidationException = Infra.ValidationException;

namespace Service;

public class UserService (IUserRepository userRepo)
{
    public void Insert(CreateUserDto dto)
    {
        var newUser = new User
        {
            UserId = Guid.NewGuid().ToString(),
            UserName = dto.UserName,
        };
        userRepo.Insert(newUser);
    }

    public User? GetById(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ValidationException("Id can't be empty");
        return userRepo.GetById(id)
               ?? throw new NotFoundException($"User whit this id '{id}' is not found");
    }

    public void Update(UpdateUserDto dto)
    {
        var user = userRepo.GetById(dto.UserId);

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
        return userRepo.GetByIdWithProducts(id)
               ?? throw new NotFoundException($"User with this id '{id}' is not found");
    }
    
    
}