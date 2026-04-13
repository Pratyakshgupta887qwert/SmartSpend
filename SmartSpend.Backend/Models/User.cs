namespace SmartSpend.Backend.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PasswordHash { get; set; }

    public string? GoogleId { get; set; }

    public string Role {get; set; } = "User";

    public DateTime? FirstLoginAt { get; set; }

    public string? ProfileImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Category> Categories { get; set; } = new List<Category>();

    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();

    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}
