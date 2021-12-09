namespace NeptunScheduler.Scheduler
{
    public class Course : TimeBlock
    {
        public string SubjectName { get; set; }
        public string Id { get; set; }
        public int AvailableSlots { get; set; }
        public bool Fix { get; set; }
        public bool CanCollide { get; set; }
        public int Priority { get; set; }
        public bool Ignored { get; set; }
    }
}
