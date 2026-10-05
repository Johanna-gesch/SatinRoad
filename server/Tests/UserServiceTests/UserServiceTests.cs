using Infra;
using Infra.Entities;
using Service;
using Service.DTOs.UserDTOs;
using Tests.Stubs;

namespace Tests.UserServiceTests;

public class UserServiceTests
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
    
    [Fact]
    public void GetAll_ReturnsAllUsersFromRepository()
    {
        // Arrange
        var repoStub = new UserRepositoryStub();
        repoStub.Users.Add(new User{UserId = "u1", UserName = "Per"});
        repoStub.Users.Add(new User{UserId = "u2", UserName = "Bob"});
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);
        
        //act
        var result = service.GetAll();
        
        //Assert
        Assert.Equal(2,result.Count);
        Assert.Contains(result, u => u.UserName == "Bob");
    }

    [Fact]
    public void GetById_returnUser_WhenUserExists()
    {
        // Arrange
        var repoStub = new UserRepositoryStub();
        repoStub.Users.Add(new User{UserId = "u1", UserName = "Per"});
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);
        
        // Act
        var result = service.GetById("u1");
        
        //Assert
        Assert.NotNull(result);
        Assert.Equal("u1", result!.UserId);
        Assert.Equal("Per", result.UserName);
    }

    [Fact]
    public void GetById_ThrowsValidationException_WhenIdIsEmpty()
    {
        // arrange
        var repoStub = new UserRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);
        
        // Act & Assert
        Assert.Throws<ValidationException>(() => service.GetById(" "));
    }
    
    [Fact]
    public void GetById_ThrowsNotFoundException_WhenUserDoesNotExist()
    {
        // arrange
        var repoStub = new UserRepositoryStub();
        var productCategoryStub = new ProductCategoryRepositoryStub();
        var service = new UserService(productCategoryStub, repoStub);
        
        // Act & Assert
        Assert.Throws<NotFoundException>(() => service.GetById("Missing"));
    }

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