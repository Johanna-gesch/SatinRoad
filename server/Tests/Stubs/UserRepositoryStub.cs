using Infra;
using Infra.Entities;

namespace Tests.Stubs;

public class UserRepositoryStub : IRepository<User>
{
    public List<User> Users { get; set; } = new();
    public void Insert(User entity)
    {
        throw new NotImplementedException();
    }

    public User? GetById(string id)
    {
        return Users.FirstOrDefault(u => u.UserId == id);
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
        return Users;
    }
}