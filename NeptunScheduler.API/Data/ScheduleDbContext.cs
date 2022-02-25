using Microsoft.EntityFrameworkCore;
using NeptunScheduler.API.Models;

namespace NeptunScheduler.Data
{
    public class ScheduleDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options)
            : base(options)
        {
        }
    }
}
