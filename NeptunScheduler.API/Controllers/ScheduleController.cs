using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NeptunScheduler.Models;
using NeptunScheduler.Data;
using NeptunScheduler.Repository;

namespace NeptunScheduler.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "user")]
    public class ScheduleController : ControllerBase
    {
        private ScheduleDbContext _context;

        private ISubjectRepository _subjectRepo;

        private IDailyActiveTimeRepository _dailyActiveTimeRepo;

        private IBusyTimeblockRepository _busyTimeblockRepo;

        public ScheduleController(ScheduleDbContext context, ISubjectRepository subjectRepo, IDailyActiveTimeRepository dailyActiveTimeRepo, IBusyTimeblockRepository busyTimeblockRepository)
        {
            _context = context;
            _subjectRepo = subjectRepo;
            _dailyActiveTimeRepo = dailyActiveTimeRepo;
            _busyTimeblockRepo = busyTimeblockRepository;
        }

        [HttpPost("subjects")]
        public ActionResult<Subject> CreateSubject(Subject dto)
        {
            User user = GetUser();
            return _subjectRepo.Add(user.Id, dto);
        }

        [HttpGet("subjects")]
        public ActionResult<List<Subject>> GetSubjects()
        {
            User user = GetUser();
            return _subjectRepo.GetAll(user.Id).ToList();
        }

        [HttpGet("subjects/{id}")]
        public ActionResult<Subject> GetSubject(string id)
        {
            User user = GetUser();
            Subject res = _subjectRepo.Get(user.Id, id);
            if (res == null)
                return BadRequest("The User has no Subject with this id.");
            return res;
        }

        [HttpPut("subjects/{id}")]
        public ActionResult<Subject> UpdateSubject(string id, Subject dto)
        {
            User user = GetUser();
            Subject res = _subjectRepo.Update(user.Id, id, dto);
            if (res == null)
                return BadRequest("The User has no Subject with this id.");
            return res;
        }

        [HttpDelete("subjects/{id}")]
        public ActionResult<Subject> DeleteSubject(string id)
        {
            User user = GetUser();
            Subject res = _subjectRepo.Delete(user.Id, id);
            if (res == null)
                return BadRequest("The User has no Subject with this id.");
            return res;
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

        [HttpPost("subjects/{subjectId}/courses/all")]
        public ActionResult<List<Course>> CreateAllCourses(string subjectId, Course[] courses)
        {
            // Find Subject.
            User user = GetUser();
            Subject subject = _context.Subjects.FirstOrDefault(x => x.Id == subjectId && x.User.Id == user.Id);
            if (subject == null)
                return BadRequest("The User has no Subject with this id.");

            // Create.
            List<Course> newCourses = new List<Course>();
            foreach (Course dto in courses)
            {
                Course course = new Course()
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
                _context.Courses.Add(course);
                newCourses.Add(course);
            }
           _context.SaveChanges();

            // Return
            return newCourses;
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
            User user = GetUser();
            return _busyTimeblockRepo.Add(user.Id, dto);
        }

        [HttpGet("busytimeblocks")]
        public ActionResult<List<BusyTimeblock>> GetBusyTimeblocks()
        {
            User user = GetUser();
            return _busyTimeblockRepo.GetAll(user.Id).ToList();
        }

        [HttpPut("busytimeblocks/{id}")]
        public ActionResult<BusyTimeblock> UpdateBusyTimeblock(string id, BusyTimeblock dto)
        {
            User user = GetUser();
            BusyTimeblock res = _busyTimeblockRepo.Update(user.Id, id, dto);
            if (res == null)
                return BadRequest("The User has no BusyTimeblock with this id.");
            return res;
        }

        [HttpDelete("busytimeblocks/{id}")]
        public ActionResult<BusyTimeblock> DeleteBusyTimeblock(string id)
        {
            User user = GetUser();
            BusyTimeblock res = _busyTimeblockRepo.Delete(user.Id, id);
            if (res == null)
                return BadRequest("The User has no BusyTimeblock with this id.");
            return res;
        }

        [HttpGet("dailyactivetimes")]
        public ActionResult<List<DailyActiveTime>> GetDailyActiveTimes()
        {
            User user = GetUser();
            var res = _dailyActiveTimeRepo.GetAll(user.Id);

            if (res.Count() == 0)
            {
                // Initialize Daily Active Times.
                for (int i = 0; i < 7; i++)
                {
                    DailyActiveTime x = new DailyActiveTime()
                    {
                        Day = i,
                        Min = 0,
                        Max = 1440,
                        User = user
                    };
                    _dailyActiveTimeRepo.Add(user.Id, x);
                }
                res = _dailyActiveTimeRepo.GetAll(user.Id);
            }

            return res.ToList();
        }

        [HttpPut("dailyactivetimes/{id}")]
        public ActionResult<DailyActiveTime> UpdateDailyActiveTime(string id, DailyActiveTime dto)
        {
            User user = GetUser();
            DailyActiveTime res = _dailyActiveTimeRepo.Update(user.Id, id, dto);
            if (res == null)
                return BadRequest("The User has no Daily Active Time with this id.");
            return res;
        }

        private User GetUser()
        {
            var identity = this.User.Identity as ClaimsIdentity;
            string userId = identity?.FindFirst("userid")?.Value;
            return _context.Users.FirstOrDefault(u => u.Id == userId);
        }
    }
}
