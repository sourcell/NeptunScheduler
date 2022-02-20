namespace NeptunScheduler.API.Models
{
    public abstract class TimeBlock
    {
        public int Day { get; set; }
        
        public Time Start { get; set; }

        public Time End { get; set; }

        public int StartTime { get => Start.Hour * 60 + Start.Minute; }

        public int EndTime { get => End.Hour * 60 + End.Minute; }
    }
}
