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

        public override string ToString()
        {
            string hourPrefix = "";
            string minutePrefix = "";

            if (Hour < 10)
                hourPrefix = "0";
            if (Minute < 10)
                minutePrefix = "0";

            return $"{hourPrefix}{Hour}:{minutePrefix}{Minute}";
        }
    }
}
