namespace SmartSpend.Backend.DTOs;

public class BudgetCreateDto
{
    public decimal AmountSet { get; set; }

    public int? Month { get; set; }

    public int? Year { get; set; }
}
