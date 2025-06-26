using Microsoft.AspNetCore.Mvc;
using server.Models;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("authenticate")]
    public IActionResult Authenticate([FromBody] LoginModel model)
    {
        // Simple hardcoded check
        if (model.Username == "user" && model.Password == "pass")
        {
            var token = GenerateJwtToken(model.Username);
            return Ok(new { success = true, data = new { token } });
        }

        return Unauthorized(new { success = false, error = "Invalid credentials" });
    }

    private string GenerateJwtToken(string username)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("supersecretkey1234567890"); // move to config in prod

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("cid", Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iss, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}