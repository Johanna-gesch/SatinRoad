using Infra;
using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.UserServiceTests;

public class DeleteUserTests
{
    [Fact]
    public void DeleteUser_DeletesTheCorrectUser()
    {
        // Arrange
        var existingUser = new User
        {
            UserId = "1",
            UserName = "Bob",
        };

        var repoStub = new UserRepositoryStub
        {
            ExistingUser = existingUser
        };

        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);
        
        //Act 
        service.Delete("1");
        
        //Assert
        Assert.Equal(existingUser, repoStub.DeletedUser);
    }
    
    [Fact]
    public void DeleteUser_throwsValidationException_UserDoesNotExist()
    {
        //Arrange
        var repoStub = new UserRepositoryStub
        {
            ExistingUser = null
        };

        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);
        
        //Act & Assert
        var exception = Assert.Throws<ValidationException>(
            () => service.Delete("does not exist")
        );
        
        Assert.Equal("User not found", exception.Message);
    }

}