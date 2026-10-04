using Infra.Entities;

namespace Infra.Repositories;

public interface IProductRepository : IRepository<Product>
{
    //Future product-specific methods go here

    List<Product> GetByVendorUserId(string vendorUserId);
    
}