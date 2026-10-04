using Infra.Entities;

namespace Service.DTOs.ProductDTOs;

public class BuyResultDto
{
    public bool PoliceRaid { get; set; }
    public string? DeletedVendorUserId { get; set; }
    public string? DeletedVendorName { get; set; }
    public List<string> DeletedProductNames { get; set; }
}