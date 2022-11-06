using System.Collections.Generic;

namespace NeptunScheduler.API
{
    public class ErrorResponse
    {
        public string Id { get; set; }

        public string Message { get; set; }

        public List<TimetableUnit> Conflicts { get; set; }
    }
}
