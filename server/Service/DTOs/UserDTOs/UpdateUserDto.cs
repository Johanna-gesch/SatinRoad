using System.Diagnostics.CodeAnalysis;

namespace Service.DTOs.UserDTOs;

public class UpdateUserDto
{
    [NotNull] public string UserId { get; set; } = "";

    public string UserName { get; set; } = "";


}