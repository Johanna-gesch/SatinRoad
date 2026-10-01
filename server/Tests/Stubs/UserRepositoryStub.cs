using Infra;
using Infra.Entities;
using Infra.Repositories;

namespace Tests.Stubs;

public class UserRepositoryStub : IUserRepository
{
    public User InsertedUser;
    public User? UpdatedUser;
    public User? ExistingUser;
    public User? DeletedUser;

    public List<User> Users { get; set; } = new();
    public void Insert(User entity)
    {
        InsertedUser = entity;
    }

    public User? GetById(string id)
    {
        return ExistingUser ?? Users.FirstOrDefault(u => u.UserId == id);
    }

    public void Update(User entity)
    {
        UpdatedUser = entity;
    }

    public void Delete(User entity)
    {
        DeletedUser = entity;
    }

    public List<User> GetAll()
    {
        return Users;
    }

    public User? GetByIdWithProducts(string id)
    {
        throw new NotImplementedException();
    }
}