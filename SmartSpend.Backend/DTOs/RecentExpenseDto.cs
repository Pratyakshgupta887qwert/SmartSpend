namespace SmartSpend.Backend.DTOs;

public class RecentExpenseDto
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public string Category { get; set; } = string.Empty;

    public DateTime SpentAt { get; set; }
}
