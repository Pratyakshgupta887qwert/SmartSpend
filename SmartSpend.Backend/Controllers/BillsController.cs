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
    [Route("api/bills")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BillsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BillsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBill(UpcomingBillCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required");

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

            var dueDate = dto.DueDate;
            if (dueDate.Kind == DateTimeKind.Unspecified)
                dueDate = DateTime.SpecifyKind(dueDate, DateTimeKind.Utc);

            var bill = new UpcomingBill
            {
                UserId = userId,
                Name = dto.Name.Trim(),
                Amount = dto.Amount,
                DueDate = dueDate,
                CategoryId = categoryId.Value
            };

            _context.UpcomingBills.Add(bill);
            await _context.SaveChangesAsync();

            return Ok(new UpcomingBillDto
            {
                Id = bill.Id,
                Name = bill.Name,
                Amount = bill.Amount,
                DueDate = bill.DueDate,
                Category = await _context.Categories
                    .Where(category => category.Id == bill.CategoryId)
                    .Select(category => category.Name)
                    .FirstAsync()
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetBills()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var bills = await _context.UpcomingBills
                .AsNoTracking()
                .Where(bill => bill.UserId == userId)
                .OrderBy(bill => bill.DueDate)
                .Select(bill => new UpcomingBillDto
                {
                    Id = bill.Id,
                    Name = bill.Name,
                    Amount = bill.Amount,
                    DueDate = bill.DueDate,
                    Category = bill.Category.Name
                })
                .ToListAsync();

            return Ok(bills);
        }
    }
}
