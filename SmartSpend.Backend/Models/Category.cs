namespace SmartSpend.Backend.Models;

public class Category
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Type { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}
