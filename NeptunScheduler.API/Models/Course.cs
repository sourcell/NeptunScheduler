using System;
using System.Text.Json.Serialization;

namespace NeptunScheduler.API.Models
{
    public class Course
    {
        public string Id { get; set; }

        public string Code { get; set; }

        public int Slots { get; set; }

        public int Day { get; set; }

        public int Start { get; set; }

        public int End { get; set; }

        public string Teachers { get; set; }

        public bool Fix { get; set; }

        public bool Collidable { get; set; }

        public int Priority { get; set; }

        public bool Ignored { get; set; }

        [JsonIgnore]
        public Subject Subject { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        public Course()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
