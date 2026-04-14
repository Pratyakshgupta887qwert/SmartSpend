namespace SmartSpend.Backend.Models;

public class UpcomingBill
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime DueDate { get; set; }

    public int CategoryId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public Category Category { get; set; } = null!;
}
