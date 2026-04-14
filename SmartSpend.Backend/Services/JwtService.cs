using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SmartSpend.Backend.Models;

namespace SmartSpend.Backend.Services{

    public class JwtService
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _environment;

        public JwtService(IConfiguration config, IWebHostEnvironment environment){
            _config=config;
            _environment=environment;
        }

        public string GenerateToken(User user){
            var claims=new[]{
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role,user.Role ?? "User"),
            new Claim("name", user.Name)
            };
        var secret = JwtConfiguration.GetSecret(_config, _environment);
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secret)
        );
        var creds= new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
