namespace NeptunScheduler.API
{
    public class ScheduleUnit
    {
        public string Title { get; set; }

        public string Code { get; set; }

        public int Slots { get; set; }

        public int Day { get; set; }

        public int Start { get; set; }

        public int End { get; set; }

        public string Teachers { get; set; }

        public bool Fix { get; set; }

        public bool Collidable { get; set; }

        public int Priority { get; set; }

        public bool IsCourse { get; set; }
    }
}
