using System.Collections.Generic;
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
    public class CoursesController : ControllerBase
    {
        private IUserRepository _userRepo;

        private ICourseRepository _courseRepo;

        public CoursesController(IUserRepository userRepo, ICourseRepository courseRepo)
        {
            _userRepo = userRepo;
            _courseRepo = courseRepo;
        }

        [HttpPut("{id}")]
        public ActionResult<Course> UpdateCourse(string id, Course dto)
        {
            // Find old Course.
            User user = GetUser();
            Course old = _courseRepo.Get(user.Id, id);
            if (old == null)
                return BadRequest("The User has no Course with this id.");

            // Update.
            return _courseRepo.Update(user.Id, id, dto);
        }

        [HttpDelete("{id}")]
        public ActionResult<Course> DeleteCourse(string id)
        {
            // Find old Course.
            User user = GetUser();
            Course old = _courseRepo.Get(user.Id, id);
            if (old == null)
                return BadRequest("The User has no Course with this id.");

            // Delete.
            return _courseRepo.Delete(user.Id, id);
        }

        [HttpPatch("")]
        public ActionResult DeleteCourse(List<string> courseIds)
        {
            User user = GetUser();
            _courseRepo.DeleteAll(user.Id, courseIds);
            return Ok();
        }

        private User GetUser()
        {
            var identity = this.User.Identity as ClaimsIdentity;
            string userId = identity?.FindFirst("userid")?.Value;
            return _userRepo.GetUserById(userId);
        }
    }
}
