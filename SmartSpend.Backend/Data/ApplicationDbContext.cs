using Microsoft.EntityFrameworkCore;
using SmartSpend.Backend.Models;

namespace SmartSpend.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Budget> Budgets { get; set; }

        public DbSet<Expense> Expenses { get; set; }

        public DbSet<UpcomingBill> UpcomingBills { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(user => user.Email)
                .IsUnique();

            modelBuilder.Entity<Category>()
                .HasIndex(category => new { category.UserId, category.Name })
                .IsUnique();

            modelBuilder.Entity<Budget>()
                .HasIndex(budget => new { budget.UserId, budget.MonthStart })
                .IsUnique();

            modelBuilder.Entity<Category>()
                .HasOne(category => category.User)
                .WithMany(user => user.Categories)
                .HasForeignKey(category => category.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Budget>()
                .HasOne(budget => budget.User)
                .WithMany(user => user.Budgets)
                .HasForeignKey(budget => budget.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Expense>()
                .HasOne(expense => expense.User)
                .WithMany(user => user.Expenses)
                .HasForeignKey(expense => expense.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Expense>()
                .HasOne(expense => expense.Category)
                .WithMany(category => category.Expenses)
                .HasForeignKey(expense => expense.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Budget>()
                .Property(budget => budget.AmountSet)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Expense>()
                .Property(expense => expense.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<UpcomingBill>()
                .Property(bill => bill.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<UpcomingBill>()
                .HasOne(bill => bill.User)
                .WithMany()
                .HasForeignKey(bill => bill.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UpcomingBill>()
                .HasOne(bill => bill.Category)
                .WithMany()
                .HasForeignKey(bill => bill.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
