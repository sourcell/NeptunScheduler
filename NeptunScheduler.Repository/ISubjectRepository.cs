using System;
using System.Linq;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public interface ISubjectRepository : IRepository<Subject>
    {
        IQueryable<Subject> GetAllWithCourses(string userId);
    }
}
