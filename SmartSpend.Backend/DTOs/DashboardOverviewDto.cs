namespace SmartSpend.Backend.DTOs;

public class DashboardOverviewDto
{
    public decimal TotalBalance { get; set; }

    public decimal TotalExpense { get; set; }

    public decimal Income { get; set; }

    public decimal SavingsRate { get; set; }
}
