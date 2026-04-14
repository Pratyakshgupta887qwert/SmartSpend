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
    [Route("api/budget")]
    [Route("api/budgets")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BudgetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BudgetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateBudget(BudgetCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            if (dto.AmountSet <= 0)
                return BadRequest("AmountSet must be greater than 0");

            var now = DateTime.UtcNow;
            var month = dto.Month ?? now.Month;
            var year = dto.Year ?? now.Year;

            if (month < 1 || month > 12)
                return BadRequest("Month must be between 1 and 12");

            var monthStart = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);

            var existing = await _context.Budgets
                .FirstOrDefaultAsync(budget => budget.UserId == userId && budget.MonthStart == monthStart);

            if (existing == null)
            {
                var budget = new Budget
                {
                    UserId = userId,
                    AmountSet = dto.AmountSet,
                    MonthStart = monthStart
                };

                _context.Budgets.Add(budget);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    budget.Id,
                    budget.AmountSet,
                    budget.MonthStart
                });
            }

            existing.AmountSet = dto.AmountSet;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                existing.Id,
                existing.AmountSet,
                existing.MonthStart
            });
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrent()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var budget = await _context.Budgets
                .AsNoTracking()
                .Where(b => b.UserId == userId && b.MonthStart == monthStart)
                .Select(b => new BudgetDto
                {
                    AmountSet = b.AmountSet,
                    MonthStart = b.MonthStart
                })
                .FirstOrDefaultAsync();

            if (budget == null)
                return Ok(new BudgetDto { AmountSet = 0, MonthStart = monthStart });

            return Ok(budget);
        }
    }
}
