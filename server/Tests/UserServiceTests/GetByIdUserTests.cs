using Infra;
using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.UserServiceTests;

public class GetByIdUserTests
{
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
}