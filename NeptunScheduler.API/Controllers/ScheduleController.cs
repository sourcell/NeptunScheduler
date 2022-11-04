﻿using System.Collections.Generic;
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

        private ICourseRepository _courseRepo;

        private IDailyActiveTimeRepository _dailyActiveTimeRepo;

        private IBusyTimeblockRepository _busyTimeblockRepo;

        public ScheduleController(IUserRepository userRepo, ISubjectRepository subjectRepo, ICourseRepository courseRepo, IDailyActiveTimeRepository dailyActiveTimeRepo, IBusyTimeblockRepository busyTimeblockRepository)
        {
            _userRepo = userRepo;
            _subjectRepo = subjectRepo;
            _courseRepo = courseRepo;
            _dailyActiveTimeRepo = dailyActiveTimeRepo;
            _busyTimeblockRepo = busyTimeblockRepository;
        }

        [HttpPost("subjects")]
        public ActionResult<Subject> CreateSubject(Subject dto)
        {
            User user = GetUser();
            return _subjectRepo.Add(user.Id, dto);
        }

        [HttpPost("subjects/all")]
        public ActionResult<List<Subject>> CreateSubject(List<Subject> subjects)
        {
            User user = GetUser();
            return _subjectRepo.AddAll(user, subjects);
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
            Subject subject = _subjectRepo.Get(user.Id, subjectId);
            if (subject == null)
                return BadRequest("The User has no Subject with this id.");

            // Create and return.
            return _courseRepo.AddToSubject(user, subject, dto);
        }

        [HttpPost("subjects/{subjectId}/courses/all")]
        public ActionResult<List<Course>> CreateAllCourses(string subjectId, Course[] courses)
        {
            // Find Subject.
            User user = GetUser();
            Subject subject = _subjectRepo.Get(user.Id, subjectId);
            if (subject == null)
                return BadRequest("The User has no Subject with this id.");

            // Create and return.
            return _courseRepo.AddAllCoursesToSubject(user, subject, courses);
        }

        [HttpGet("subjects/{subjectId}/courses")]
        public ActionResult<List<Course>> GetCourses(string subjectId)
        {
            User user = GetUser();
            return _courseRepo.GetCoursesBySubjectId(user.Id, subjectId);
        }

        [HttpPut("courses/{id}")]
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

        [HttpDelete("courses/{id}")]
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

        [HttpPatch("courses")]
        public ActionResult DeleteCourse(List<string> courseIds)
        {
            User user = GetUser();
            _courseRepo.DeleteAll(user.Id, courseIds);
            return Ok();
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

        [HttpGet("generate")]
        public ActionResult<List<List<TimetableUnit>>> GenerateSchedules()
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
                List<TimetableUnit> colliders = new List<TimetableUnit>();
                exception.Colliders.ForEach(timeBlock => {
                    if (timeBlock is Course)
                    {
                        Course course = timeBlock as Course;
                        colliders.Add(new TimetableUnit() {
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
                        colliders.Add(new TimetableUnit() {
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

            List<List<TimetableUnit>> timetables = new List<List<TimetableUnit>>();
                results.ForEach(result => {
                    List<TimetableUnit> timetable = new List<TimetableUnit>();
                    result.ForEach(course => {
                        timetable.Add(new TimetableUnit() {
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
                        timetable.Add(new TimetableUnit() {
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
