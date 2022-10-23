using NeptunScheduler.Models;

namespace NeptunScheduler.Repository
{
    public interface IUserRepository
    {
        User GetUserById(string id);

        bool IsUsernameInUse(string username);

        int TotalNumberOfUsers();

        User Add(User user);

        User GetUserByUsernameAndPassword(string username, string password);
    }
}
