namespace NeptunScheduler.Scheduler
{
    public class Course : TimeBlock
    {
        public string SubjectName { get; set; }
        public string ID { get; set; }
        public int AvailableSlots { get; set; }
        public int Day { get; set; }
        public bool Fix { get; set; }
    }
}
