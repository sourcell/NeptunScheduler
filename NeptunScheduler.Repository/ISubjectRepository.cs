using System;
using System.Collections.Generic;
using System.Linq;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public interface ISubjectRepository : IRepository<Subject>
    {
        List<Subject> AddAll(User user, List<Subject> subjects);
        IQueryable<Subject> GetAllWithCourses(string userId);
    }
}
