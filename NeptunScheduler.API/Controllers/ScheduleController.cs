using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeptunScheduler.Models;
using NeptunScheduler.Repository;
using NeptunScheduler.Scheduler;

namespace NeptunScheduler.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "user")]
    public class ScheduleController : ControllerBase
    {
        private IUserRepository _userRepo;

        private ISubjectRepository _subjectRepo;

        private IDailyActiveTimeRepository _dailyActiveTimeRepo;

        private IBusyTimeblockRepository _busyTimeblockRepo;

        public ScheduleController(IUserRepository userRepo, ISubjectRepository subjectRepo, IDailyActiveTimeRepository dailyActiveTimeRepo, IBusyTimeblockRepository busyTimeblockRepository)
        {
            _userRepo = userRepo;
            _subjectRepo = subjectRepo;
            _dailyActiveTimeRepo = dailyActiveTimeRepo;
            _busyTimeblockRepo = busyTimeblockRepository;
        }

        [HttpGet("generate")]
        public ActionResult<List<List<ScheduleUnit>>> GenerateSchedules()
        {
            User user = GetUser();

            List<Subject> subjects = _subjectRepo.GetAllWithCourses(user.Id).ToList();
            List<BusyTimeblock> busyTimeblocks = _busyTimeblockRepo.GetAll(user.Id).ToList();
            List<DailyActiveTime> dailyActiveTimes = _dailyActiveTimeRepo.GetAll(user.Id).ToList();

            Backtracking bt = new Backtracking(subjects, busyTimeblocks, dailyActiveTimes);

            List<List<Course>> results;
            try
            {
                results = bt.PossibleResults();
            }
            catch (ConflictException exception)
            {
                List<ScheduleUnit> colliders = new List<ScheduleUnit>();
                exception.Colliders.ForEach(timeBlock => {
                    if (timeBlock is Course)
                    {
                        Course course = timeBlock as Course;
                        colliders.Add(new ScheduleUnit() {
                            Title = course.Subject.Title,
                            Code = course.Code,
                            Slots = course.Slots,
                            Day = course.Day,
                            Start = course.Start,
                            End = course.End,
                            Teachers = course.Teachers,
                            Fix = course.Fix,
                            Collidable = course.Collidable,
                            Priority = course.Priority,
                            IsCourse = true
                        });
                    }
                    else
                    {
                        BusyTimeblock busy = timeBlock as BusyTimeblock;
                        colliders.Add(new ScheduleUnit() {
                            Title = busy.Title,
                            Day = busy.Day,
                            Start = busy.Start,
                            End = busy.End,
                            IsCourse = false
                        });
                    }
                });
                return BadRequest(new ErrorResponse() {
                    Id = "conflict",
                    Message = "There are conflicts between the fix timeblocks (fix courses + busy timeblocks).",
                    Conflicts = colliders.OrderBy(x => x.Day).ThenBy(x => x.Start).ToList()
                });
            }
            catch (NoResultException)
            {
                return BadRequest(new ErrorResponse() {
                    Id = "no-result",
                    Message = "No possible results are found."
                });
            }

            List<List<ScheduleUnit>> timetables = new List<List<ScheduleUnit>>();
                results.ForEach(result => {
                    List<ScheduleUnit> timetable = new List<ScheduleUnit>();
                    result.ForEach(course => {
                        timetable.Add(new ScheduleUnit() {
                            Title = course.Subject.Title,
                            Code = course.Code,
                            Slots = course.Slots,
                            Day = course.Day,
                            Start = course.Start,
                            End = course.End,
                            Teachers = course.Teachers,
                            Fix = course.Fix,
                            Collidable = course.Collidable,
                            Priority = course.Priority,
                            IsCourse = true
                        });
                    });
                    busyTimeblocks.ForEach(busy => {
                        timetable.Add(new ScheduleUnit() {
                            Title = busy.Title,
                            Day = busy.Day,
                            Start = busy.Start,
                            End = busy.End,
                            IsCourse = false
                        });
                    });
                    timetables.Add(timetable.OrderBy(x => x.Day).ThenBy(x => x.Start).ToList());
                });
                return timetables.Take(10).ToList();
        }

        private User GetUser()
        {
            var identity = this.User.Identity as ClaimsIdentity;
            string userId = identity?.FindFirst("userid")?.Value;
            return _userRepo.GetUserById(userId);
        }
    }
}
