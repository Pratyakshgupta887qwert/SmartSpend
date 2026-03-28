using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SmartSpend.Backend.Data;
using SmartSpend.Backend.DTOs;
using SmartSpend.Backend.Models;
using SmartSpend.Backend.Services;
using Microsoft.EntityFrameworkCore;


namespace SmartSpend.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //depedency injecting
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        public AuthController(ApplicationDbContext context, JwtService jwtService){
            _context=context;
            _jwtService=jwtService;
        
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
                    Role="User"
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

                    var token= _jwtService.GenerateToken(user);
                    return Ok(new{token});
        }       
            

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            if (!User.Identity.IsAuthenticated)
                return Redirect("http://localhost:5173/");

            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var googleId= User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _context.Users.FirstOrDefaultAsync(u=>u.Email==email);
            if(user==null){
                user= new User{
                    Name=name,
                    Email=email,
                    GoogleId=googleId
                };
                _context.Users.Add(user);
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

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            // await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            // return Redirect("http://localhost:5173/");
            return Ok("Logged Out Successfully");
        }
    }
}