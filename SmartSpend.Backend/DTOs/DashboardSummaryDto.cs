namespace SmartSpend.Backend.DTOs;

public class DashboardSummaryDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public decimal AmountSet { get; set; }

    public decimal TotalSpent { get; set; }

    public decimal Savings { get; set; }

    public decimal SavingsRate { get; set; }

    public int TotalTransactions { get; set; }

    public List<CategorySpendingDto> CategoryBreakdown { get; set; } = new();
}
