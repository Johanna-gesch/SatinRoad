using Infra;
using Infra.Entities;
using Service.DTOs.UserDTOs;
using ValidationException = Infra.ValidationException;

namespace Service;

public class UserService (IRepository<User> userRepo)
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

    public void Update(User entity)
    {
        throw new NotImplementedException();
    }

    public void Delete(string id)
    {
        throw new NotImplementedException();
    }
    
    public List<User> GetAll()
    {
        return userRepo.GetAll();
    }
    
    
}