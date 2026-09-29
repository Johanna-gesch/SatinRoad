using Infra;
using Infra.Entities;
using Service;
using Service.DTOs.UserDTOs;
using Tests.Stubs;

namespace Tests.UserServiceTests;

public class UserServiceTests
{
    [Fact]
    public void CreateUser_InsertToRepository()
    {
        // Arrange
        var repoStub = new UserRepositoryStub();
        var service = new UserService(repoStub);

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
        var service = new UserService(repoStub);
        
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
        var service = new UserService(repoStub);
        
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
        var service = new UserService(repoStub);
        
        // Act & Assert
        Assert.Throws<ValidationException>(() => service.GetById(" "));
    }
    
    [Fact]
    public void GetById_ThrowsNotFoundException_WhenUserDoesNotExist()
    {
        // arrange
        var repoStub = new UserRepositoryStub();
        var service = new UserService(repoStub);
        
        // Act & Assert
        Assert.Throws<NotFoundException>(() => service.GetById("Missing"));
    }
    

    
}