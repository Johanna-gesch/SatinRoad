using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

public class UserController (UserService service) : ControllerBase
{
    [HttpGet(nameof(GetUsers))]
    public List<User> GetUsers()
    {
        return service.GetAll();
    }

    [HttpGet(nameof(GetUserById))]
    public User GetUserById(string userId)
    {
        return service.GetById(userId);

    }
    
    
}