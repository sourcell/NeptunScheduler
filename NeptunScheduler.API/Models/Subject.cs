using System;
using System.Collections.Generic;

namespace NeptunScheduler.API.Models
{
    public class Subject
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public int Credits { get; set; }

        public List<Course> Courses { get; set; }

        public User User { get; set; }

        public Subject()
        {
            Id = Guid.NewGuid().ToString();
            Courses = new List<Course>();
        }
    }
}
