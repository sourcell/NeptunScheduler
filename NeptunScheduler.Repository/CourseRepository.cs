using System.Collections.Generic;
using System.Linq;
using NeptunScheduler.Data;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public class CourseRepository : ICourseRepository
    {
        private readonly ScheduleDbContext _context;

        public CourseRepository(ScheduleDbContext context)
        {
            _context = context;
        }

        public Course Add(string userId, Course item)
        {
            throw new System.NotImplementedException();
        }

        public Course AddToSubject(User user, Subject subject, Course course)
        {
            Course newCourse = new Course()
            {
                Code = course.Code,
                Slots = course.Slots,
                Day = course.Day,
                Start = course.Start,
                End = course.End,
                Teachers = course.Teachers,
                Fix = course.Fix,
                Collidable = course.Collidable,
                Priority = course.Priority,
                Ignored = course.Ignored,
                Subject = subject,
                User = user
            };
            _context.Courses.Add(newCourse);
            _context.SaveChanges();
            return _context.Courses.FirstOrDefault(x => x.Id == newCourse.Id);
        }

        public List<Course> AddAllCoursesToSubject(User user, Subject subject, Course[] courses)
        {
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
                newCourses.Add(course);
            }
            _context.Courses.AddRange(newCourses);
            _context.SaveChanges();
            return newCourses;
        }

        public Course Delete(string userId, string id)
        {
            Course old = Get(userId, id);
            if (old == null)
                return null;

            _context.Courses.Remove(old);
            _context.SaveChanges();

            return old;
        }

        public Course Get(string userId, string id)
        {
            return _context.Courses.FirstOrDefault(x => x.Id == id && x.User.Id == userId);
        }

        public IQueryable<Course> GetAll(string userId)
        {
            throw new System.NotImplementedException();
        }

        public List<Course> GetCoursesBySubjectId(string userId, string subjectId)
        {
            return _context.Courses.Where(x => x.User.Id == userId && x.Subject.Id == subjectId).ToList();
        }

        public Course Update(string userId, string id, Course item)
        {
            Course old = Get(userId, id);
            if (old == null)
                return null;

            old.Code = item.Code;
            old.Slots = item.Slots;
            old.Day = item.Day;
            old.Start = item.Start;
            old.End = item.End;
            old.Teachers = item.Teachers;
            old.Fix = item.Fix;
            old.Collidable = item.Collidable;
            old.Priority = item.Priority;
            old.Ignored = item.Ignored;
            _context.SaveChanges();

            return old;
        }
    }
}
