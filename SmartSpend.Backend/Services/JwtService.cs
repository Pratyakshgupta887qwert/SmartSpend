using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SmartSpend.Backend.Models;

namespace SmartSpend.Backend.Services{

    public class JwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config){
            _config=config;
        }

        public string GenerateToken(User user){
            var claims=new[]{
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role,user.Role)
            };
        var secret = _config["JwtSettings:Secret"];

if (string.IsNullOrEmpty(secret))
{
    throw new Exception("JWT Secret is missing in configuration");
}
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