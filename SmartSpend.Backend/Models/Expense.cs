namespace SmartSpend.Backend.Models;

public class Expense
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public DateTime SpentAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public Category Category { get; set; } = null!;
}
