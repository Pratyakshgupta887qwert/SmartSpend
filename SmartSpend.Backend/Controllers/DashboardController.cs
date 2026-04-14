using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSpend.Backend.Data;
using SmartSpend.Backend.DTOs;

namespace SmartSpend.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] int? month, [FromQuery] int? year)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var now = DateTime.UtcNow;
            var selectedMonth = month ?? now.Month;
            var selectedYear = year ?? now.Year;

            if (selectedMonth < 1 || selectedMonth > 12)
                return BadRequest("Month must be between 1 and 12");

            var monthStart = new DateTime(selectedYear, selectedMonth, 1, 0, 0, 0, DateTimeKind.Utc);
            var nextMonthStart = monthStart.AddMonths(1);

            var budgetAmount = await _context.Budgets
                .AsNoTracking()
                .Where(budget => budget.UserId == userId && budget.MonthStart == monthStart)
                .Select(budget => budget.AmountSet)
                .FirstOrDefaultAsync();

            var expensesInMonth = _context.Expenses
                .AsNoTracking()
                .Where(expense =>
                    expense.UserId == userId &&
                    expense.SpentAt >= monthStart &&
                    expense.SpentAt < nextMonthStart);

            var totalSpent = await expensesInMonth
                .Select(expense => (decimal?)expense.Amount)
                .SumAsync() ?? 0m;

            var totalTransactions = await expensesInMonth.CountAsync();

            var categoryBreakdown = await expensesInMonth
                .GroupBy(expense => expense.Category.Name)
                .Select(group => new
                {
                    Category = group.Key,
                    Amount = group.Sum(expense => expense.Amount)
                })
                .OrderByDescending(item => item.Amount)
                .ToListAsync();

            var savings = budgetAmount - totalSpent;
            var savingsRate = budgetAmount > 0
                ? Math.Round((savings / budgetAmount) * 100, 2)
                : 0m;

            var response = new DashboardSummaryDto
            {
                Year = selectedYear,
                Month = selectedMonth,
                AmountSet = budgetAmount,
                TotalSpent = totalSpent,
                Savings = savings,
                SavingsRate = savingsRate,
                TotalTransactions = totalTransactions,
                CategoryBreakdown = categoryBreakdown
                    .Select(item => new CategorySpendingDto
                    {
                        Category = item.Category,
                        Amount = item.Amount,
                        Percentage = totalSpent > 0
                            ? Math.Round((item.Amount / totalSpent) * 100, 2)
                            : 0m
                    })
                    .ToList()
            };

            return Ok(response);
        }
    }
}
