namespace SmartSpend.Backend.DTOs;

public class MonthlyExpenseDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public decimal TotalExpense { get; set; }
}
