namespace SmartSpend.Backend.Models;

public class Budget
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal AmountSet { get; set; }

    public DateTime MonthStart { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
