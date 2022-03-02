using System;
using System.Text.Json.Serialization;

namespace NeptunScheduler.API.Models
{
    public class BusyTimeBlock
    {
        public string Id { get; set; }

        public int Day { get; set; }
        
        public int StartHour { get; set; }
        
        public int StartMinute { get; set; }

        public int EndHour { get; set; }
        
        public int EndMinute { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        public BusyTimeBlock()
        {
            Id = Guid.NewGuid().ToString();
        }
    }
}
