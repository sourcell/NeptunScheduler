namespace NeptunScheduler.Models
{
    public abstract class TimeBlock
    {
        public int Day { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
}
