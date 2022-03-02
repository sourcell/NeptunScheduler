using System;
using System.Text.Json.Serialization;

namespace NeptunScheduler.API.Models
{
    public class DailyActiveTime
    {
        public string Id { get; set; }

        public int Day { get; set; }

        public int Min { get; set; }

        public int Max { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        public DailyActiveTime()
        {
            this.Id = Guid.NewGuid().ToString();
        }
    }
}
