using Infra.Entities;
using Service;
using Service.DTOs.UserDTOs;
using Tests.Stubs;

namespace Tests.UserServiceTests;

public class UpdateUserTests
{
    [Fact]
    public void UpdateUser_UpdateUserName()
    {
        //Arrange
        var existingUser = new User
        {
            UserId = "1",
            UserName = "Bob",
        };

        var repoStub = new UserRepositoryStub()
        {
            ExistingUser = existingUser
        };

        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);

        
        var dto = new UpdateUserDto
        {
            UserId = "1",
            UserName = "New name"
        };
        // Act
        service.Update(dto);
        
        //Assert
        Assert.Equal("New name", repoStub.UpdatedUser!.UserName);
    }
}