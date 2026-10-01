using Infra.Entities;
using LinqToDB;

namespace Infra.Repositories;

public class UserRepository (MyDataConnection dc) : IUserRepository
{
    public void Insert(User entity)
    {
        dc.Insert(entity);
    }

    public User? GetById(string id)
    { 
        return dc.Users.FirstOrDefault(u => u.UserId == id);
    }

    public void Update(User entity)
    {
        dc.Update(entity);
    }

    public void Delete(User entity)
    {
        dc.Delete(entity);
    }

    public List<User> GetAll()
    {
        return dc.Users.ToList();
    }

    public User? GetByIdWithProducts(string id)
    {
        return dc.Users
            .LoadWith(u => u.Products)
            .FirstOrDefault(u => u.UserId == id);
    }
}