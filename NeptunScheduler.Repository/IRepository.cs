using System;
using System.Linq;

namespace NeptunScheduler.Repository
{
    public interface IRepository<T>
    {
        T Add(string userId, T item);

        T Get(string userId, string id);

        IQueryable<T> GetAll(string userId);

        T Update(string userId, string id, T item);

        T Delete(string userId, string id, T item);
    }
}
