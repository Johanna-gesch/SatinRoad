using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Service.DTOs.CategoryDTOs;

public class UpdateCategoryRequestDto
{
    [NotNull] [MinLength(1)] public string CategoryIdForLookup { get; set; } = "";

    public string? NewCategoryName { get; set; } = "";
}