namespace SmartSpend.Backend.DTOs;

public class CategorySpendingDto
{
    public string Category { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public decimal Percentage { get; set; }
}
