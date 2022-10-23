using System.Linq;
using NeptunScheduler.Data;
using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ScheduleDbContext _context;

        public UserRepository(ScheduleDbContext context)
        {
            _context = context;
        }

        public User GetUserById(string id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public bool IsUsernameInUse(string username)
        {
            return _context.Users.Count(u => u.Username == username) > 0;
        }

        public int TotalNumberOfUsers()
        {
            return _context.Users.Count();
        }

        public User Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return _context.Users.FirstOrDefault(x => x.Id == user.Id);
        }

        public User GetUserByUsernameAndPassword(string username, string password)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);
        }
    }
}
