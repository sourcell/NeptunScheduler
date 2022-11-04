using Microsoft.EntityFrameworkCore;
using NeptunScheduler.Models;

namespace NeptunScheduler.Data
{
    public class ScheduleDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Subject> Subjects { get; set; }

        public DbSet<Course> Courses { get; set; }

        public DbSet<BusyTimeblock> BusyTimeblocks { get; set; }

        public DbSet<DailyActiveTime> DailyActiveTimes { get; set; }

        public ScheduleDbContext()
        {
        }

        public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                optionsBuilder.UseSqlite("Data Source=../NeptunScheduler.Data/Database.db;Cache=Shared");
        }
    }
}
