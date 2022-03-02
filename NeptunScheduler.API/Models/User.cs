using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NeptunScheduler.API.Models
{
    public class User
    {
        public string Id { get; set; }

        public string Username { get; set; }

        [JsonIgnore]
        public string PasswordHash { get; set; }
        
        public string Roles { get; set; }

        public List<Subject> Subjects { get; set; }

        public List<Course> Courses { get; set; }

        public List<BusyTimeblock> BusyTimeblocks { get; set; }

        public List<DailyActiveTime> DailyActiveTimes { get; set; }

        public User()
        {
            this.Id = Guid.NewGuid().ToString();
            this.Subjects = new List<Subject>();
            this.Courses = new List<Course>();
            this.BusyTimeblocks = new List<BusyTimeblock>();
        }
    }
}
