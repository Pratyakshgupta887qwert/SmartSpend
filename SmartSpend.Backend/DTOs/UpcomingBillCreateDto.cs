namespace SmartSpend.Backend.DTOs;

public class UpcomingBillCreateDto
{
    public string Name { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime DueDate { get; set; }

    public int? CategoryId { get; set; }

    public string? CategoryName { get; set; }
}
