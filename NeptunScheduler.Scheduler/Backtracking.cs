using System;
using System.Collections.Generic;
using System.Linq;

namespace NeptunScheduler.Scheduler
{
    public class Backtracking
    {
        List<List<Course>> finalResults;
        List<Subject> subjects;
        List<BusyTimeBlock> busyTimeBlocks;
        List<Course> fixCourses;

        public Backtracking(List<Subject> subjects, List<BusyTimeBlock> busies)
        {
            this.finalResults = new List<List<Course>>();
            this.subjects = subjects;
            this.busyTimeBlocks = busies;
            this.fixCourses = new List<Course>();

            this.subjects.ForEach(s =>
            {
                s.Courses.ForEach(c =>
                {
                    if (c.Fix)
                        fixCourses.Add(c);
                });
            });
        }

        public List<List<Course>> PossibleResults()
        {
            // Check if there is collision between fix timeblocks
            if (CheckCollisions().Count > 0)
            {
                throw new ArgumentException("There are initial collisions between the fix timeblocks (fix courses + busy timeblocks).");
            }

            // Temporary result array to work with
            Course[] result = new Course[subjects.Count];

            Backtrack(result, 0);

            return finalResults;
        }

        private List<TimeBlock> CheckCollisions()
        {
            List<TimeBlock> timeBlocks = new List<TimeBlock>();
            fixCourses.ForEach(c => timeBlocks.Add(c));
            busyTimeBlocks.ForEach(b => timeBlocks.Add(b));

            List<TimeBlock> colliders = new List<TimeBlock>();

            timeBlocks.ForEach(x =>
            {
                timeBlocks.ForEach(y =>
                {
                    if (x != y && x.CollideWith(y))
                        if (!colliders.Contains(x))
                            colliders.Add(x);
                });
            });

            return colliders;
        }

        private void Backtrack(Course[] result, int level)
        {
            // Optional Courses of the current Subject
            List<Course> courses = subjects[level].Courses.Where(c => !c.Fix).ToList();
            
            for (int i = 0; i < courses.Count; i++)
            {
                result[level] = courses[i];

                if (IsValid(result, level))
                {
                    if (level == result.Length - 1)
                        finalResults.Add(result.ToList());
                    else
                        Backtrack(result, level + 1);
                }
            }
        }

        private bool IsValid(Course[] result, int level)
        {
            // Check collision with lower levels
            for (int i = 0; i < level; i++)
                if (result[i].CollideWith(result[level]))
                    return false;

            // Check collision with the fix courses
            foreach (Course fixCourse in fixCourses)
                if (fixCourse.CollideWith(result[level]))
                    return false;

            // Check collision with the busy timeblocks
            foreach (BusyTimeBlock busyTimeBlock in busyTimeBlocks)
                if (busyTimeBlock.CollideWith(result[level]))
                    return false;

            return true;
        }
    }
}
