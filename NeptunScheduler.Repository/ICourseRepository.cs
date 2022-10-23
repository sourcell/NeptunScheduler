using System;
using System.Collections.Generic;
using System.Linq;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public interface ICourseRepository : IRepository<Course>
    {
        Course AddToSubject(User user, Subject subject, Course course);

        List<Course> AddAllCoursesToSubject(User user, Subject subject, Course[] courses);

        List<Course> GetCoursesBySubjectId(string userId, string subjectId);
    }
}
