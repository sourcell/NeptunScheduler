using Microsoft.EntityFrameworkCore;
using NeptunScheduler.API.Models;

namespace NeptunScheduler.Data
{
    public class ScheduleDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Subject> Subjects { get; set; }

        public DbSet<Course> Courses { get; set; }

        public DbSet<BusyTimeblock> BusyTimeblocks { get; set; }

        public DbSet<DailyActiveTime> DailyActiveTimes { get; set; }

        public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options)
            : base(options)
        {
        }
    }
}
