using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NeptunScheduler.API.Models;
using NeptunScheduler.Data;

namespace NeptunScheduler.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScheduleController : ControllerBase
    {
        private ScheduleDbContext _context;

        public ScheduleController(ScheduleDbContext context)
        {
            _context = context;
        }

        [HttpGet("init")]
        public IActionResult Init()
        {
            _context.Subjects.Add(new Subject() { Name = "Teszt tárgy" });
            _context.SaveChanges();
            
            return Ok();
        }

        [HttpGet("getall")]
        public IEnumerable<Subject> Get()
        {
            var subjects = _context.Subjects;
            return subjects;
        }
    }
}
