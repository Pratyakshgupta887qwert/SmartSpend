namespace SmartSpend.Backend.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? GoogleId { get; set; }

    public string Role {get; set; } = "User";

    public DateTime? FirstLoginAt { get; set; }

    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}