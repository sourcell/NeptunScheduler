using System;
using System.Text.Json.Serialization;

namespace NeptunScheduler.Models
{
    public class BusyTimeblock
    {
        public string Id { get; set; }

        public int Day { get; set; }

        public int Start { get; set; }

        public int End { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        public BusyTimeblock()
        {
            this.Id = Guid.NewGuid().ToString();
        }
    }
}
