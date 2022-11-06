using System;
using System.Collections.Generic;
using NeptunScheduler.Models;

namespace NeptunScheduler.Scheduler
{
    public class ConflictException : Exception
    {
        public List<TimeBlock> Colliders { get; set; }
    }
}
