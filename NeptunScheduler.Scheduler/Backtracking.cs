using System;
using System.Collections.Generic;
using System.Linq;

namespace NeptunScheduler.Scheduler
{
    public class Backtracking
    {
        public List<List<Course>> PossibleResults(List<Subject> subjects, List<BusyTimeBlock> busies)
        {
            // This list will contain all the possible schedules
            List<List<Course>> finalResults = new List<List<Course>>();

            // Accumulate all the fix courses and busy timeblocks into this list
            List<TimeBlock> fixes = new List<TimeBlock>();

            subjects.ForEach(s => {
                s.Courses.ForEach(c => {
                    if (c.Fix)
                    {
                        fixes.Add(c);
                    }
                });
            });

            busies.ForEach(b => fixes.Add(b));

            // Check if there is collision between fix timeblocks
            if (CheckCollisions(fixes).Count > 0)
            {
                throw new ArgumentException("There are collisions.");
            }

            // Temporary result to work with
            Course[] result = new Course[subjects.Count];

            Backtrack(subjects, fixes, result, 0, finalResults);

            return finalResults;
        }

        private List<TimeBlock> CheckCollisions(List<TimeBlock> timeBlocks)
        {
            List<TimeBlock> colliders = new List<TimeBlock>();

            timeBlocks.ForEach(x => {
                timeBlocks.ForEach(y => {
                    if (x != y && x.CollideWith(y))
                    {
                        if (!colliders.Contains(x))
                        {
                            colliders.Add(x);
                        }
                    }
                });
            });

            return colliders;
        }

        private void Backtrack(List<Subject> subjects, List<TimeBlock> fixes, Course[] result, int level, List<List<Course>> finalResults)
        {
            // Optional Courses of the current Subject
            List<Course> courses = subjects[level].Courses.Where(c => !c.Fix).ToList();
            
            for (int i = 0; i < courses.Count; i++)
            {
                result[level] = courses[i];

                if (level == result.Length - 1)
                {
                    finalResults.Add(result.ToList());
                }
                else
                {
                    Backtrack(subjects, fixes, result, level + 1, finalResults);
                }
            }
        }
    }
}
