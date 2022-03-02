using System;
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

        [HttpGet("subjects")]
        public ActionResult<List<Subject>> GetSubjects()
        {
            User user = GetUser();
            return _context.Subjects.Where(x => x.User.Id == user.Id).ToList();
        }

        [HttpGet("subjects/{id}")]
        public ActionResult<Subject> GetSubject(string id)
        {
            User user = GetUser();
            return _context.Subjects.FirstOrDefault(x => x.User.Id == user.Id && x.Id == id);
        }

        [HttpPut("subjects/{id}")]
        public ActionResult<Subject> UpdateSubject(string id, Subject dto)
        {
            // Find old Subject.
            User user = GetUser();
            Subject old = _context.Subjects.FirstOrDefault(x => x.Id == id && x.User.Id == user.Id);
            if (old == null)
                return BadRequest("The User has no Subject with this id.");

            // Update.
            old.Title = dto.Title;
            old.Credits = dto.Credits;
            _context.SaveChanges();

            return old;
        }

        [HttpDelete("subjects/{id}")]
        public ActionResult<Subject> DeleteSubject(string id)
        {
            // Find old Subject.
            User user = GetUser();
            Subject old = _context.Subjects.FirstOrDefault(x => x.Id == id && x.User.Id == user.Id);
            if (old == null)
                return BadRequest("The User has no Subject with this id.");

            // Delete.
            _context.Subjects.Remove(old);
            _context.SaveChanges();

            return old;
        }

        [HttpPost("subjects/{subjectId}/courses")]
        public ActionResult<Course> CreateCourse(string subjectId, Course dto)
        {
            // Find Subject.
            User user = GetUser();
            Subject subject = _context.Subjects.FirstOrDefault(x => x.Id == subjectId && x.User.Id == user.Id);
            if (subject == null)
                return BadRequest("The User has no Subject with this id.");

            // Create.
            Course newCourse = new Course()
            {
                Code = dto.Code,
                Slots = dto.Slots,
                Day = dto.Day,
                Start = dto.Start,
                End = dto.End,
                Teachers = dto.Teachers,
                Fix = dto.Fix,
                Collidable = dto.Collidable,
                Priority = dto.Priority,
                Ignored = dto.Ignored,
                Subject = subject,
                User = user
            };
            _context.Courses.Add(newCourse);
            _context.SaveChanges();

            // Return
            return user.Courses.FirstOrDefault(x => x.Id == newCourse.Id);
        }

        [HttpGet("subjects/{subjectId}/courses")]
        public ActionResult<List<Course>> GetCourses(string subjectId)
        {
            User user = GetUser();
            return _context.Courses.Where(x => x.User.Id == user.Id && x.Subject.Id == subjectId).ToList();
        }

        [HttpPut("courses/{id}")]
        public ActionResult<Course> UpdateCourse(string id, Course dto)
        {
            // Find old Course.
            User user = GetUser();
            Course old = _context.Courses.FirstOrDefault(x => x.Id == id && x.User.Id == user.Id);
            if (old == null)
                return BadRequest("The User has no Course with this id.");

            // Update.
            old.Code = dto.Code;
            old.Slots = dto.Slots;
            old.Day = dto.Day;
            old.Start = dto.Start;
            old.End = dto.End;
            old.Teachers = dto.Teachers;
            old.Fix = dto.Fix;
            old.Collidable = dto.Collidable;
            old.Priority = dto.Priority;
            old.Ignored = dto.Ignored;
            _context.SaveChanges();

            return old;
        }

        [HttpDelete("courses/{id}")]
        public ActionResult<Course> DeleteCourse(string id)
        {
            // Find old Course.
            User user = GetUser();
            Course old = _context.Courses.FirstOrDefault(x => x.Id == id && x.User.Id == user.Id);
            if (old == null)
                return BadRequest("The User has no Course with this id.");

            // Delete.
            _context.Courses.Remove(old);
            _context.SaveChanges();

            return old;
        }

        [HttpPost("busytimeblocks")]
        public ActionResult<BusyTimeblock> CreateBusyTimeblock(BusyTimeblock dto)
        {
            // Create.
            User user = GetUser();
            BusyTimeblock newBusyTimeblock = new BusyTimeblock()
            {
                Day = dto.Day,
                Start = dto.Start,
                End = dto.End,
                User = user
            };

            _context.BusyTimeblocks.Add(newBusyTimeblock);
            _context.SaveChanges();

            // Return
            return _context.BusyTimeblocks.FirstOrDefault(x => x.Id == newBusyTimeblock.Id);
        }

        [HttpGet("busytimeblocks")]
        public ActionResult<List<BusyTimeblock>> GetBusyTimeblocks()
        {
            User user = GetUser();
            return _context.BusyTimeblocks.Where(x => x.User.Id == user.Id).ToList();
        }

        [HttpPut("busytimeblocks/{id}")]
        public ActionResult<BusyTimeblock> UpdateBusyTimeblock(string id, BusyTimeblock dto)
        {
            // Find old BusyTimeblock.
            User user = GetUser();
            BusyTimeblock old = _context.BusyTimeblocks.FirstOrDefault(x => x.Id == id && x.User.Id == user.Id);
            if (old == null)
                return BadRequest("The User has no BusyTimeblock with this id.");

            // Update.
            old.Day = dto.Day;
            old.Start = dto.Start;
            old.End = dto.End;
            _context.SaveChanges();

            return old;
        }

        [HttpDelete("busytimeblocks/{id}")]
        public ActionResult<BusyTimeblock> DeleteBusyTimeblock(string id)
        {
            // Find old BusyTimeblock.
            User user = GetUser();
            BusyTimeblock old = _context.BusyTimeblocks.FirstOrDefault(x => x.Id == id && x.User.Id == user.Id);
            if (old == null)
                return BadRequest("The User has no BusyTimeblock with this id.");

            // Delete.
            _context.BusyTimeblocks.Remove(old);
            _context.SaveChanges();

            return old;
        }

        private User GetUser()
        {
            var identity = this.User.Identity as ClaimsIdentity;
            string userId = identity?.FindFirst("userid")?.Value;
            return _context.Users.FirstOrDefault(u => u.Id == userId);
        }
    }
}
