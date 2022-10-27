using System;
using System.Text.Json.Serialization;

namespace NeptunScheduler.Models
{
    public class Course : TimeBlock
    {
        public string Id { get; set; }

        public string Code { get; set; }

        public int Slots { get; set; }

        public string Teachers { get; set; }

        public bool Fix { get; set; }

        public bool Collidable { get; set; }

        public int Priority { get; set; }

        public bool Ignored { get; set; }

        [JsonIgnore]
        public Subject Subject { get; set; }

        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        public Course()
        {
            this.Id = Guid.NewGuid().ToString();
        }
    }
}
