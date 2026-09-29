using Infra.Entities;
using LinqToDB;

namespace Infra.Repositories;

public class UserRepository (MyDataConnection dc) : IRepository<User>
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
        throw new NotImplementedException();
    }

    public void Delete(User entity)
    {
        throw new NotImplementedException();
    }

    public List<User> GetAll()
    {
        return dc.Users.ToList();
    }
}