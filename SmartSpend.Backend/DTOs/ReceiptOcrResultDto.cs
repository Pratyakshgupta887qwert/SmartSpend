namespace SmartSpend.Backend.DTOs;

public class ReceiptOcrResultDto
{
    public string Merchant { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal? Amount { get; set; }
    public string Category { get; set; } = "";
    public string Date { get; set; } = "";
    public string Currency { get; set; } = "INR";
    public string RawText { get; set; } = "";
}
