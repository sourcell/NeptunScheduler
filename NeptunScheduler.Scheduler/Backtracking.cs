using System;
using System.Collections.Generic;
using System.Linq;

namespace NeptunScheduler.Scheduler
{
    public class Backtracking
    {
        List<List<Course>> finalResults;
        List<Subject> subjects;
        List<TimeBlock> fixes;

        public Backtracking(List<Subject> subjects, List<BusyTimeBlock> busies)
        {
            this.finalResults = new List<List<Course>>();
            this.subjects = subjects;
            this.fixes = new List<TimeBlock>();

            this.subjects.ForEach(s => {
                s.Courses.ForEach(c => {
                    if (c.Fix)
                        fixes.Add(c);
                });
            });

            busies.ForEach(b => fixes.Add(b));
        }

        public List<List<Course>> PossibleResults()
        {
            // Check if there is collision between fix timeblocks
            if (CheckCollisions(fixes).Count > 0)
            {
                throw new ArgumentException("There are collisions.");
            }

            // Temporary result array to work with
            Course[] result = new Course[subjects.Count];

            Backtrack(result, 0);

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
                    {
                        finalResults.Add(result.ToList());
                    }
                    else
                    {
                        Backtrack(result, level + 1);
                    }
                }
            }
        }

        private bool IsValid(Course[] result, int level)
        {
            for (int i = 0; i < level; i++)
            {
                if (result[i].CollideWith(result[level]))
                    return false;
            }

            return true;
        }
    }
}
