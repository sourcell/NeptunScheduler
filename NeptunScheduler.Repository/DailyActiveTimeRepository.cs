using System.Linq;
using NeptunScheduler.Data;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public class DailyActiveTimeRepository : IDailyActiveTimeRepository
    {
        private readonly ScheduleDbContext _context;

        public DailyActiveTimeRepository(ScheduleDbContext context)
        {
            _context = context;
        }

        public DailyActiveTime Add(string userId, DailyActiveTime item)
        {
            // Create.
            DailyActiveTime newDailyActiveTime = new DailyActiveTime()
            {
                Day = item.Day,
                Min = item.Min,
                Max = item.Max,
                UserId = userId
            };
            _context.DailyActiveTimes.Add(newDailyActiveTime);
            _context.SaveChanges();

            // Result.
            return _context.DailyActiveTimes.FirstOrDefault(x => x.Id == newDailyActiveTime.Id);
        }

        public IQueryable<DailyActiveTime> GetAll(string userId)
        {
            return _context.DailyActiveTimes.Where(x => x.User.Id == userId);
        }

        public DailyActiveTime Get(string userId, string id)
        {
            return GetAll(userId).FirstOrDefault(x => x.Id == id);
        }

        public DailyActiveTime Update(string userId, string id, DailyActiveTime item)
        {
            // Find old DailyActiveTime.
            DailyActiveTime old = Get(userId, id);
            if (old == null)
                return null;

            // Update.
            old.Day = item.Day;
            old.Min = item.Min;
            old.Max = item.Max;
            _context.SaveChanges();

            return old;
        }

        public DailyActiveTime Delete(string userId, string id)
        {
            // Find old DailyActiveTime.
            DailyActiveTime old = Get(userId, id);
            if (old == null)
                return null;

            // Update.
            _context.DailyActiveTimes.Remove(old);
            _context.SaveChanges();

            return old;
        }
    }
}
