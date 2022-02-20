using System;

namespace NeptunScheduler.API.Models
{
    public class Course
    {
        public string Id { get; set; }

        public string SubjectName { get; set; }

        public string NeptunId { get; set; }

        public int AvailableSlots { get; set; }

        public bool Fix { get; set; }

        public bool CanCollide { get; set; }

        public int Priority { get; set; }

        public bool Ignored { get; set; }

        public int Day { get; set; }
        
        public int StartHour { get; set; }
        
        public int StartMinute { get; set; }

        public int EndHour { get; set; }
        
        public int EndMinute { get; set; }

        public string SubjectId { get; set; }

        public Subject Subject { get; set; }

        public Course()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
