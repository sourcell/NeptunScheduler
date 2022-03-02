using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NeptunScheduler.Models
{
    public class Subject
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public int Credits { get; set; }

        public List<Course> Courses { get; set; }

        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        public Subject()
        {
            this.Id = Guid.NewGuid().ToString();
            this.Courses = new List<Course>();
        }
    }
}
