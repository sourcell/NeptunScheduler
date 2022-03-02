using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NeptunScheduler.API.Models
{
    public class DailyActiveTime
    {
        public string Id { get; set; }

        public int Day { get; set; }

        public int Minutes { get; set; }

        public User User { get; set; }

        public DailyActiveTime()
        {
            this.Id = Guid.NewGuid().ToString();
        }
    }
}
