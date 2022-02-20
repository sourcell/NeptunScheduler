using Microsoft.EntityFrameworkCore;
using NeptunScheduler.API.Models;

namespace NeptunScheduler.Data
{
    public class ScheduleDbContext : DbContext
    {
        public DbSet<Subject> Subjects { get; set; }

        public DbSet<Course> Courses { get; set; }

        public DbSet<BusyTimeBlock> BusyTimeBlocks { get; set; }

        public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options)
            : base(options)
        {
        }
    }
}