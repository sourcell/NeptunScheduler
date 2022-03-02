using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NeptunScheduler.Models;
using NeptunScheduler.Data;

namespace NeptunScheduler.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ScheduleDbContext context;

        public AuthController(ScheduleDbContext context)
        {
            this.context = context;
        }

        [HttpPost("register")]
        public ActionResult<User> Register(UserDto user)
        {
            // Check if username exists.
            if (this.context.Users.Count(u => u.Username == user.Username) > 0)
            {
                return BadRequest("Username is already in use.");
            }

            User newUser = new User()
            {
                Username = user.Username,
                PasswordHash = user.Password
            };

            // Add roles to the user.
            newUser.Roles += "user";
            if (this.context.Users.Count() == 0)
            {
                newUser.Roles += "|admin";
            }

            // Add user to the context.
            this.context.Users.Add(newUser);
            this.context.SaveChanges();

            // Return newly added user.
            return this.context.Users.FirstOrDefault(u => u.Username == user.Username);
        }

        [HttpPost("login")]
        public ActionResult<LoginResult> Login(UserDto userDto)
        {
            // Check if username and password is correct.
            User user = this.context.Users.FirstOrDefault(u => u.Username == userDto.Username && u.PasswordHash == userDto.Password);
            if (user == null)
            {
                return BadRequest("Username or password is incorrect.");
            }

            // Create claims.
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim("userid", user.Id));
            foreach (string role in user.Roles.Split('|'))
            {
                claims.Add(new Claim("role", role));
            }

            // Create token key.
            SecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("very safe key..."));

            // Create token.
            JwtSecurityToken token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(55),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new LoginResult()
            {
                Id = user.Id,
                Username = user.Username,
                Roles = user.Roles,
                Token = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }

        [HttpGet("n")]
        public ActionResult<int> NumberOfUsers()
        {
            return this.context.Users.Count();
        }
    }

    public class UserDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginResult
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Roles { get;set; }
        public string Token { get; set; }
    }
}
