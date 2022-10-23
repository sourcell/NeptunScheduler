using System;
using System.Text.Json.Serialization;

namespace NeptunScheduler.Models
{
    public class BusyTimeblock : TimeBlock
    {
        public string Id { get; set; }

        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        public BusyTimeblock()
        {
            this.Id = Guid.NewGuid().ToString();
        }
    }
}
