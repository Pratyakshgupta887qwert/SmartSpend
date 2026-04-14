using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSpend.Backend.Data;
using SmartSpend.Backend.DTOs;
using SmartSpend.Backend.Models;

namespace SmartSpend.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ExpensesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExpensesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense(ExpenseCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            if (dto.Amount <= 0)
                return BadRequest("Amount must be greater than 0");

            var categoryId = dto.CategoryId;
            if (!categoryId.HasValue)
            {
                var categoryName = dto.CategoryName?.Trim();
                if (string.IsNullOrWhiteSpace(categoryName))
                    return BadRequest("CategoryId or CategoryName is required");

                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(category =>
                        category.UserId == userId &&
                        category.Name.ToLower() == categoryName.ToLower());

                if (existingCategory == null)
                {
                    var newCategory = new Category
                    {
                        UserId = userId,
                        Name = categoryName
                    };

                    _context.Categories.Add(newCategory);
                    await _context.SaveChangesAsync();
                    categoryId = newCategory.Id;
                }
                else
                {
                    categoryId = existingCategory.Id;
                }
            }

            var spentAt = dto.SpentAt ?? DateTime.UtcNow;
            if (spentAt.Kind == DateTimeKind.Unspecified)
                spentAt = DateTime.SpecifyKind(spentAt, DateTimeKind.Utc);

            var expense = new Expense
            {
                UserId = userId,
                CategoryId = categoryId.Value,
                Amount = dto.Amount,
                Description = dto.Description?.Trim(),
                SpentAt = spentAt
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return Ok(new RecentExpenseDto
            {
                Id = expense.Id,
                Amount = expense.Amount,
                Description = expense.Description,
                Category = (await _context.Categories
                    .Where(category => category.Id == expense.CategoryId)
                    .Select(category => category.Name)
                    .FirstAsync()),
                SpentAt = expense.SpentAt
            });
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int? limit)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var take = limit.HasValue && limit.Value > 0 ? Math.Min(limit.Value, 50) : 10;

            var recent = await _context.Expenses
                .AsNoTracking()
                .Where(expense => expense.UserId == userId)
                .OrderByDescending(expense => expense.SpentAt)
                .Take(take)
                .Select(expense => new RecentExpenseDto
                {
                    Id = expense.Id,
                    Amount = expense.Amount,
                    Description = expense.Description,
                    Category = expense.Category.Name,
                    SpentAt = expense.SpentAt
                })
                .ToListAsync();

            return Ok(recent);
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

            var totalExpense = await _context.Expenses
                .AsNoTracking()
                .Where(expense =>
                    expense.UserId == userId &&
                    expense.SpentAt >= monthStart &&
                    expense.SpentAt < nextMonthStart)
                .Select(expense => (decimal?)expense.Amount)
                .SumAsync() ?? 0m;

            return Ok(new ExpenseSummaryDto
            {
                Year = selectedYear,
                Month = selectedMonth,
                TotalExpense = totalExpense
            });
        }
    }
}
