using Service;
using Service.DTOs.CategoryDTOs;
using Tests.Stubs;

namespace Tests.CategoryServiceTests;

public class CreateCategoryServiceTests
{
    [Fact]
    public void CreateCategory_InsertsCategoryCorrectly()
    {
        //Arrange
        var stub = new CategoryRepositoryStub();
        var service = new CategoryService(stub);

        var dto = new CreateCategoryRequestDto
        {
            CategoryName = "Drugs"
        };
        
        //Act
        service.CreateCategory(dto);
        
        //Assert
        Assert.NotNull(stub.InsertedCategory);
        Assert.Equal("Drugs", stub.InsertedCategory.CategoryName);
        Assert.False((string.IsNullOrWhiteSpace(stub.InsertedCategory.CategoryId)));
    }
}