namespace NeptunScheduler.Scheduler
{
    public class Time
    {
        public int Hour { get; set; }
        public int Minute { get; set; }

        public Time(int hour, int minute)
        {
            this.Hour = hour;
            this.Minute = minute;
        }
    }
}
