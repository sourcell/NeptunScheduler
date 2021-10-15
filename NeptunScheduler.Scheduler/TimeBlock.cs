namespace NeptunScheduler.Scheduler
{
    public abstract class TimeBlock
    {
        public int Day { get; set; }
        public Time Start { get; set; }
        public Time End { get; set; }
        public int StartTime { get => Start.Hour * 60 + Start.Minute; }
        public int EndTime { get => End.Hour * 60 + End.Minute; }

        public virtual bool CollideWith(TimeBlock other)
        {
            return !(other.EndTime < this.StartTime || other.StartTime > this.EndTime) && other.Day == this.Day;
        }
    }
}
