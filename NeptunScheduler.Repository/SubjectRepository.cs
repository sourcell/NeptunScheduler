using System;
using System.Linq;
using NeptunScheduler.Data;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly ScheduleDbContext _context;

        public SubjectRepository(ScheduleDbContext context)
        {
            _context = context;
        }

        public Subject Add(string userId, Subject item)
        {
            // Create.
            Subject newSubject = new Subject()
            {
                Title = item.Title,
                Credits = item.Credits,
                UserId = userId
            };
            _context.Subjects.Add(newSubject);
            _context.SaveChanges();

            // Result.
            return _context.Subjects.FirstOrDefault(x => x.Id == newSubject.Id);
        }

        public IQueryable<Subject> GetAll(string userId)
        {
            return _context.Subjects.Where(x => x.User.Id == userId);
        }

        public Subject Get(string userId, string id)
        {
            return GetAll(userId).FirstOrDefault(x => x.Id == id);
        }

        public Subject Update(string userId, string id, Subject item)
        {
            // Find old Subject.
            Subject old = Get(userId, id);
            if (old == null)
                return null;

            // Update.
            old.Title = item.Title;
            old.Credits = item.Credits;
            _context.SaveChanges();

            return old;
        }

        public Subject Delete(string userId, string id, Subject item)
        {
            // Find old Subject.
            Subject old = Get(userId, id);
            if (old == null)
                return null;

            // Delete.
            _context.Subjects.Remove(old);
            _context.SaveChanges();

            return old;
        }
    }
}
