using Infra.Entities;
using Service;
using Tests.Stubs;

namespace Tests.UserServiceTests;

public class GetAllUsersTests
{
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
}