using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeptunScheduler.Models;
using NeptunScheduler.Repository;

namespace NeptunScheduler.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "user")]
    public class SubjectsController : ControllerBase
    {
        private IUserRepository _userRepo;

        private ISubjectRepository _subjectRepo;

        private ICourseRepository _courseRepo;

        public SubjectsController(IUserRepository userRepo, ISubjectRepository subjectRepo, ICourseRepository courseRepo)
        {
            _userRepo = userRepo;
            _subjectRepo = subjectRepo;
            _courseRepo = courseRepo;
        }

        [HttpPost("")]
        public ActionResult<Subject> CreateSubject(Subject dto)
        {
            User user = GetUser();
            return _subjectRepo.Add(user.Id, dto);
        }

        [HttpPost("all")]
        public ActionResult<List<Subject>> CreateSubjects(List<Subject> subjects)
        {
            User user = GetUser();
            return _subjectRepo.AddAll(user, subjects);
        }

        [HttpGet("")]
        public ActionResult<List<Subject>> GetSubjects()
        {
            User user = GetUser();
            return _subjectRepo.GetAll(user.Id).OrderByDescending(x => x.Credits).ThenBy(x => x.Title).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<Subject> GetSubject(string id)
        {
            User user = GetUser();
            Subject res = _subjectRepo.Get(user.Id, id);
            if (res == null)
                return BadRequest("The User has no Subject with this id.");
            return res;
        }

        [HttpPut("{id}")]
        public ActionResult<Subject> UpdateSubject(string id, Subject dto)
        {
            User user = GetUser();
            Subject res = _subjectRepo.Update(user.Id, id, dto);
            if (res == null)
                return BadRequest("The User has no Subject with this id.");
            return res;
        }

        [HttpDelete("{id}")]
        public ActionResult<Subject> DeleteSubject(string id)
        {
            User user = GetUser();
            Subject res = _subjectRepo.Delete(user.Id, id);
            if (res == null)
                return BadRequest("The User has no Subject with this id.");
            return res;
        }

        [HttpPost("{id}/courses")]
        public ActionResult<Course> CreateCourse(string id, Course dto)
        {
            // Find Subject.
            User user = GetUser();
            Subject subject = _subjectRepo.Get(user.Id, id);
            if (subject == null)
                return BadRequest("The User has no Subject with this id.");

            // Create and return.
            return _courseRepo.AddToSubject(user, subject, dto);
        }

        [HttpPost("{id}/courses/all")]
        public ActionResult<List<Course>> CreateAllCourses(string id, Course[] courses)
        {
            // Find Subject.
            User user = GetUser();
            Subject subject = _subjectRepo.Get(user.Id, id);
            if (subject == null)
                return BadRequest("The User has no Subject with this id.");

            // Create and return.
            return _courseRepo.AddAllCoursesToSubject(user, subject, courses);
        }

        [HttpGet("{id}/courses")]
        public ActionResult<List<Course>> GetCourses(string id)
        {
            User user = GetUser();
            return _courseRepo.GetCoursesBySubjectId(user.Id, id).OrderBy(x => x.Day).ThenBy(x => x.Start).ToList();
        }

        private User GetUser()
        {
            var identity = this.User.Identity as ClaimsIdentity;
            string userId = identity?.FindFirst("userid")?.Value;
            return _userRepo.GetUserById(userId);
        }
    }
}
