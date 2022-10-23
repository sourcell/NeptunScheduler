using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NeptunScheduler.Models;
using NeptunScheduler.Repository;

namespace NeptunScheduler.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;

        public AuthController(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpPost("register")]
        public ActionResult<User> Register(UserDto user)
        {
            // Check if username exists.
            if (_userRepo.IsUsernameInUse(user.Username))
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
            if (_userRepo.TotalNumberOfUsers() == 0)
            {
                newUser.Roles += "|admin";
            }

            // Add and return user.
            return _userRepo.Add(newUser);
        }

        [HttpPost("login")]
        public ActionResult<LoginResult> Login(UserDto userDto)
        {
            // Check if username and password is correct.
            User user = _userRepo.GetUserByUsernameAndPassword(userDto.Username, userDto.Password);
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
            return _userRepo.TotalNumberOfUsers();
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
