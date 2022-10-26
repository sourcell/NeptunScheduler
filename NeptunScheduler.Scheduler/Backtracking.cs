using System;
using System.Collections.Generic;
using System.Linq;
using NeptunScheduler.Models;

namespace NeptunScheduler.Scheduler
{
    public class Backtracking
    {
        List<List<Course>> finalResults;
        List<Subject> subjects;
        List<BusyTimeblock> busyTimeBlocks;
        List<Course> fixCourses;
        int bestWastedMinutes = int.MaxValue;

        public Backtracking(List<Subject> subjects, List<BusyTimeblock> busies)
        {
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
            List<TimeBlock> colliders = CheckCollisions();
            if (colliders.Count > 0)
                throw new ConflictException();

            // Temporary result array to work with
            Course[] result = new Course[subjects.Count];
            Backtrack(result, 0);
            Console.WriteLine("found results: " + finalResults.Count);
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
                    if (x != y && DoCollide(x, y))
                        if (!colliders.Contains(x))
                            colliders.Add(x);
                });
            });

            return colliders;
        }

        private void Backtrack(Course[] result, int level)
        {
            // Optional Courses of the current Subject
            List<Course> courses = subjects[level].Courses.Where(c => !c.Fix && c.Slots > 0).OrderByDescending(c => c.Priority).ToList();

            if (courses.Count == 0)
                courses.Add(new Course() { Day = -1, Start = 0, End = 0, Collidable = true });
            
            for (int i = 0; i < courses.Count; i++)
            {
                result[level] = courses[i];
                if (IsValid(result, level))
                {
                    if (level == result.Length - 1)
                    {
                        List<Course> res = result.Where(x => x.Day != -1).ToList();
                        res.AddRange(fixCourses);
                        res = res.OrderBy(x => x.Day).ThenBy(x => x.Start).ToList();
                        int wastedMinutes = WastedMinutes(res);
                        if (wastedMinutes <= bestWastedMinutes)
                        {
                            if (wastedMinutes < bestWastedMinutes)
                            {
                                finalResults = new List<List<Course>>();
                                bestWastedMinutes = wastedMinutes;
                            }
                            finalResults.Add(res);
                        }
                    }
                    else
                        Backtrack(result, level + 1);
                }
            }
        }

        private bool IsValid(Course[] result, int level)
        {
            // Check collision with lower levels
            for (int i = 0; i < level; i++)
                if (DoCollide(result[i], result[level]))
                    return false;

            // Check collision with the fix courses
            foreach (Course fixCourse in fixCourses)
                if (DoCollide(fixCourse, result[level]))
                    return false;

            // Check collision with the busy timeblocks
            foreach (BusyTimeblock busyTimeBlock in busyTimeBlocks)
                if (DoCollide(busyTimeBlock, result[level]))
                    return false;

            return true;
        }

        private bool DoCollide(TimeBlock a, TimeBlock b)
        {
            if (a is Course && b is Course && (a as Course).Collidable && (b as Course).Collidable)
            {
                return false;
            }

            return a.Day == b.Day && !(a.End < b.Start || a.Start > b.End);
        }

        public int WastedMinutes(List<Course> result) {
            int totalMinutes = 0;
            int activeMinutes = 0;
            Course first = null;
            for (int i = 0; i < result.Count; i++)
            {
                activeMinutes += result[i].End - result[i].Start;
                if (i == 0 || result[i-1].Day != result[i].Day)
                    first = result[i];
                if (i == result.Count - 1 || result[i+1].Day != result[i].Day)
                    totalMinutes += result[i].End - first.Start;
            }
            return totalMinutes - activeMinutes;
        }
    }
}
