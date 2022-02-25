﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NeptunScheduler.API.Models;
using NeptunScheduler.Data;

namespace NeptunScheduler.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "user")]
    public class ScheduleController : ControllerBase
    {
        private ScheduleDbContext _context;

        public ScheduleController(ScheduleDbContext context)
        {
            _context = context;
        }

        [HttpPost("subjects")]
        public ActionResult<Subject> CreateSubject(Subject dto)
        {
            // Create.
            User user = GetUser();
            Subject newSubject = new Subject()
            {
                Title = dto.Title,
                Credits = dto.Credits
            };
            user.Subjects.Add(newSubject);
            _context.SaveChanges();

            // Return
            return user.Subjects.FirstOrDefault(x => x.Id == newSubject.Id);
        }

        private User GetUser()
        {
            var identity = this.User.Identity as ClaimsIdentity;
            string userId = identity?.FindFirst("userid")?.Value;
            return _context.Users.FirstOrDefault(u => u.Id == userId);
        }
    }
}
