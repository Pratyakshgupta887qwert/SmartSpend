namespace SmartSpend.Backend.DTOs;

public class CategoryBreakdownDto
{
    public string Category { get; set; } = string.Empty;

    public decimal TotalExpense { get; set; }
}
