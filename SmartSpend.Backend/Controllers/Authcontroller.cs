using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SmartSpend.Backend.Data;
using SmartSpend.Backend.DTOs;
using SmartSpend.Backend.Models;
using SmartSpend.Backend.Services;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.IO;


namespace SmartSpend.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
        {
            "User",
            "Student",
            "Business"
        };

        //depedency injecting
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IWebHostEnvironment _environment;

        public AuthController(ApplicationDbContext context, JwtService jwtService, IWebHostEnvironment environment){
            _context=context;
            _jwtService=jwtService;
            _environment = environment;
        
        }

        private string GetProfileImagesDirectory()
        {
            var root = _environment.ContentRootPath;
            var uploadsFolder = Path.Combine(root, "Uploads", "profile-images");
            Directory.CreateDirectory(uploadsFolder);
            return uploadsFolder;
        }

        private static string GetContentType(string extension)
        {
            return extension.ToLowerInvariant() switch
            {
                ".png" => "image/png",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }

        private static string? NormalizeProfileImageUrl(string? profileImageUrl)
        {
            if (string.IsNullOrWhiteSpace(profileImageUrl))
                return profileImageUrl;

            if (profileImageUrl.StartsWith("/profile-images/", StringComparison.OrdinalIgnoreCase))
            {
                var fileName = Path.GetFileName(profileImageUrl);
                return $"/api/auth/profile-image/{fileName}";
            }

            return profileImageUrl;
        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = "/api/auth/google-response"
            };

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto){
            var existingUser= await _context.Users.FirstOrDefaultAsync(u=>u.Email==registerDto.Email);
            if(existingUser!=null)
                return BadRequest("User Already Exists");

                var user= new User{
                    Name= registerDto.Name,
                    Email= registerDto.Email,
                    PasswordHash=BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    Role="User",
                    FirstLoginAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token= _jwtService.GenerateToken(user);

            return Ok(new{token});
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser(LoginDto loginDto){
            var user= await _context.Users.FirstOrDefaultAsync(u=>u.Email==loginDto.Email);
            if(user==null)
                return Unauthorized("Invalid Credentials");

                var ValidPassword=BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
                if(!ValidPassword)
                    return Unauthorized("Invalid Credentials");

                    if (user.FirstLoginAt == null)
                    {
                        user.FirstLoginAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                    }

                    var token= _jwtService.GenerateToken(user);
                    return Ok(new{token});
        }       
            

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            if (User.Identity?.IsAuthenticated != true)
                return Redirect("http://localhost:5173/");

            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var googleId= User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _context.Users.FirstOrDefaultAsync(u=>u.Email==email);
            if(user==null){
                user= new User{
                    Name=name ?? "User",
                    Email=email ?? string.Empty,
                    GoogleId=googleId,
                    FirstLoginAt = DateTime.UtcNow
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            else if (user.FirstLoginAt == null)
            {
                user.FirstLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            var token= _jwtService.GenerateToken(user);

            return Redirect($"http://localhost:5173/dashboard?token={token}");
        }

        [HttpGet("secure")]
        [Authorize]
        public IActionResult SecureEndpoint()
        {
            return Ok("You are authenticated and allowed here!");
        }

        [HttpGet("profile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                user.Name,
                user.Email,
                user.Role,
                user.FirstLoginAt,
                ProfileImageUrl = NormalizeProfileImageUrl(user.ProfileImageUrl),
                user.CreatedAt
            });
        }

        [HttpPut("profile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var trimmedName = dto.Name?.Trim();
            var trimmedEmail = dto.Email?.Trim();
            var nextRole = dto.Role?.Trim();

            if (string.IsNullOrWhiteSpace(trimmedName) || trimmedName.Length < 2)
                return BadRequest("Name must be at least 2 characters");

            if (string.IsNullOrWhiteSpace(trimmedEmail) || !new EmailAddressAttribute().IsValid(trimmedEmail))
                return BadRequest("Please provide a valid email address");

            if (string.IsNullOrWhiteSpace(nextRole) || !AllowedRoles.Contains(nextRole))
                return BadRequest("Invalid role selected");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found");

            var emailExists = await _context.Users.AnyAsync(u => u.Id != userId && u.Email == trimmedEmail);
            if (emailExists)
                return BadRequest("Email is already in use");

            user.Name = trimmedName;
            user.Email = trimmedEmail;
            user.Role = nextRole.Equals("student", StringComparison.OrdinalIgnoreCase)
                ? "Student"
                : nextRole.Equals("business", StringComparison.OrdinalIgnoreCase)
                    ? "Business"
                    : "User";

            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                message = "Profile updated successfully",
                token,
                user = new
                {
                    user.Name,
                    user.Email,
                    user.Role,
                    user.FirstLoginAt,
                    ProfileImageUrl = NormalizeProfileImageUrl(user.ProfileImageUrl),
                    user.CreatedAt
                }
            });
        }

        [HttpPost("profile-image")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UploadProfileImage([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("Please upload an image file");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Only .jpg, .jpeg, .png and .webp files are allowed");

            if (image.Length > 2 * 1024 * 1024)
                return BadRequest("Image size must be 2MB or less");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found");

            var uploadsFolder = GetProfileImagesDirectory();

            var fileName = $"{userId}_{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            user.ProfileImageUrl = $"/api/auth/profile-image/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile image uploaded successfully",
                profileImageUrl = user.ProfileImageUrl
            });
        }

        [HttpGet("profile-image/{fileName}")]
        [AllowAnonymous]
        public IActionResult GetProfileImage(string fileName)
        {
            var safeFileName = Path.GetFileName(fileName);
            if (string.IsNullOrWhiteSpace(safeFileName))
                return BadRequest("Invalid file name");

            var primaryPath = Path.Combine(GetProfileImagesDirectory(), safeFileName);
            if (System.IO.File.Exists(primaryPath))
            {
                var extension = Path.GetExtension(primaryPath);
                return PhysicalFile(primaryPath, GetContentType(extension));
            }

            var legacyPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "profile-images", safeFileName);
            if (System.IO.File.Exists(legacyPath))
            {
                var extension = Path.GetExtension(legacyPath);
                return PhysicalFile(legacyPath, GetContentType(extension));
            }

            return NotFound();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            // await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            // return Redirect("http://localhost:5173/");
            return Ok("Logged Out Successfully");
        }
    }
}