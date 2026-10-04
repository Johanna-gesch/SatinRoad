using Infra.Entities;

namespace Infra.Repositories;

public interface IUserRepository : IRepository<User>
{
    User? GetByIdWithProducts(string id);

}