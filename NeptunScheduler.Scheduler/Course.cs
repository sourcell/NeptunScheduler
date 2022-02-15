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

        public override bool CollideWith(TimeBlock other)
        {
            if (CanCollide && other is Course && (other as Course).CanCollide)
            {
                return false;
            }

            return !(other.EndTime < this.StartTime || other.StartTime > this.EndTime) && other.Day == this.Day;
        }

        public override string ToString()
        {
            return $"{SubjectName} | day: {Day} | {Start} - {End}";
        }
    }
}
