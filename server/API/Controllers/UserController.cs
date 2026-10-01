using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTOs.UserDTOs;

namespace API.Controllers;

public class UserController (UserService userService, ProductService productService) : ControllerBase
{
    [HttpPost(nameof(CreateUser))]
    public void CreateUser(CreateUserDto dto)
    {
        userService.Insert(dto);
    }
    [HttpGet(nameof(GetUsers))]
    public List<User> GetUsers()
    {
        return userService.GetAll();
    }

    [HttpGet(nameof(GetUserById))]
    public User GetUserById(string userId)
    {
        return userService.GetById(userId);

    }

    [HttpPut(nameof(UpdateUser))]
    public void UpdateUser(UpdateUserDto dto)
    {
        userService.Update(dto);
    }

    [HttpDelete(nameof(DeleteUser))]
    public void DeleteUser(string id)
    {
        productService.DeleteAllForVendor(id);   
        userService.Delete(id);
    }

    [HttpGet(nameof(GetUserWithProducts))]
    public User GetUserWithProducts(string id)
    {
        return userService.GetIdWithProducts(id);
    }
    
    
    
    
}