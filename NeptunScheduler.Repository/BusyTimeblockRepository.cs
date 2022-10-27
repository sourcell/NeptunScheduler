using System.Linq;
using NeptunScheduler.Data;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public class BusyTimeblockRepository : IBusyTimeblockRepository
    {
        private readonly ScheduleDbContext _context;

        public BusyTimeblockRepository(ScheduleDbContext context)
        {
            _context = context;
        }

        public BusyTimeblock Add(string userId, BusyTimeblock item)
        {
            // Create.
            BusyTimeblock newBusyTimeblock = new BusyTimeblock()
            {
                Title = item.Title,
                Day = item.Day,
                Start = item.Start,
                End = item.End,
                UserId = userId
            };
            _context.BusyTimeblocks.Add(newBusyTimeblock);
            _context.SaveChanges();

            // Result.
            return _context.BusyTimeblocks.FirstOrDefault(x => x.Id == newBusyTimeblock.Id);
        }

        public IQueryable<BusyTimeblock> GetAll(string userId)
        {
            return _context.BusyTimeblocks.Where(x => x.User.Id == userId);
        }

        public BusyTimeblock Get(string userId, string id)
        {
            return GetAll(userId).FirstOrDefault(x => x.Id == id);
        }

        public BusyTimeblock Update(string userId, string id, BusyTimeblock item)
        {
            // Find old BusyTimeblock.
            BusyTimeblock old = Get(userId, id);
            if (old == null)
                return null;

            // Update.
            old.Title = item.Title;
            old.Day = item.Day;
            old.Start = item.Start;
            old.End = item.End;
            _context.SaveChanges();

            return old;
        }

        public BusyTimeblock Delete(string userId, string id)
        {
            // Find old BusyTimeblock.
            BusyTimeblock old = Get(userId, id);
            if (old == null)
                return null;

            // Update.
            _context.BusyTimeblocks.Remove(old);
            _context.SaveChanges();

            return old;
        }
    }
}
