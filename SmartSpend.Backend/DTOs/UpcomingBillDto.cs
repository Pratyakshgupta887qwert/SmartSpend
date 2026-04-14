namespace SmartSpend.Backend.DTOs;

public class UpcomingBillDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime DueDate { get; set; }

    public string Category { get; set; } = string.Empty;
}
