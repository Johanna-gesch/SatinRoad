using Infra;
using Infra.Entities;
using ValidationException = Infra.ValidationException;

namespace Service;

public class UserService (IRepository<User> userRepo)
{
    public void Insert(User entity)
    {
        throw new NotImplementedException();
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