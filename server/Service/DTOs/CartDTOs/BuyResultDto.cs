using Infra.Entities;

namespace Service.DTOs.ProductDTOs;

public class BuyResultDto
{
    public bool PoliceRaid { get; set; }
    public List<string> DeletedVendorUserIds { get; set; }
    public List<string> DeletedVendorNames { get; set; }
    public List<string> PurchasedProductNames { get; set; }
    
    
}