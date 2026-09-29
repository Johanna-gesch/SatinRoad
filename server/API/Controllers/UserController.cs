using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTOs.UserDTOs;

namespace API.Controllers;

public class UserController (UserService service) : ControllerBase
{
    [HttpPost(nameof(CreateUser))]
    public void CreateUser(CreateUserDto dto)
    {
        service.Insert(dto);
    }
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

    [HttpPut(nameof(UpdateUser))]
    public void UpdateUser(UpdateUserDto dto)
    {
        service.Update(dto);
    }
    
    
}