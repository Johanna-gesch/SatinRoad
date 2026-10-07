using Service;
using Service.DTOs.UserDTOs;
using Tests.Stubs;

namespace Tests.UserServiceTests;

public class CreateUserTests
{
    [Fact]
    public void CreateUser_InsertToRepository()
    {
        // Arrange
        var repoStub = new UserRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);

        var dto = new CreateUserDto
        {
            UserName = "Bob"
        };
        // act 
        service.Insert(dto);
        
        // Assert
        Assert.NotNull(repoStub.InsertedUser);
        Assert.Equal("Bob", repoStub.InsertedUser.UserName);
        Assert.False(string.IsNullOrEmpty(repoStub.InsertedUser.UserId));
    }
}