namespace SmartSpend.Backend.DTOs;

public class UpdateProfileDto
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = "User";
}
