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
        List<DailyActiveTime> dailyActiveTimes;
        int bestWastedMinutes = int.MaxValue;

        public Backtracking(List<Subject> subjects, List<BusyTimeblock> busies, List<DailyActiveTime> dailyActiveTimes)
        {
            this.subjects = subjects;
            this.busyTimeBlocks = busies;
            this.fixCourses = new List<Course>();
            this.dailyActiveTimes = dailyActiveTimes;

            this.subjects.ForEach(subject =>
            {
                subject.Courses.ForEach(course =>
                {
                    if (course.Fix && !course.Ignored)
                        fixCourses.Add(course);
                });
            });
        }

        public List<List<Course>> PossibleResults()
        {
            if (subjects.Count == 0)
                throw new NoResultException();

            // Check if there is collision between fix timeblocks
            List<TimeBlock> colliders = CheckCollisions();
            if (colliders.Count > 0)
                throw new ConflictException() {
                    Colliders = colliders
                };

            // Temporary result array to work with
            Course[] result = new Course[subjects.Count];
            Backtrack(result, 0);
            if (finalResults == null)
                throw new NoResultException();
            Console.WriteLine("found results: " + finalResults.Count);
            return finalResults.OrderByDescending(res => res.Sum(x => x.Priority)).ToList();
        }

        private List<TimeBlock> CheckCollisions()
        {
            List<TimeBlock> timeBlocks = new List<TimeBlock>();
            timeBlocks.AddRange(fixCourses);
            timeBlocks.AddRange(busyTimeBlocks);

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
            List<Course> courses = subjects[level].Courses.Where(c => !c.Fix && c.Slots > 0 && !c.Ignored).ToList();
            if (courses.Count == 0)
                courses.Add(new Course() { Day = -1, Start = 0, End = 0, Collidable = true });
            
            for (int i = 0; i < courses.Count; i++)
            {
                result[level] = courses[i];
                if (!IsValid(result, level))
                    continue;

                if (level != result.Length - 1)
                {
                    Backtrack(result, level + 1);
                    continue;
                }

                List<Course> res = result.Where(x => x.Day != -1).ToList();
                res.AddRange(fixCourses);
                res = res.OrderBy(x => x.Day).ThenBy(x => x.Start).ToList();

                if (!IsValidDailyActiveTimes(res))
                    continue;

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
        }

        private bool IsValid(Course[] result, int level)
        {
            for (int i = 0; i < level; i++)
                if (DoCollide(result[i], result[level]))
                    return false;

            foreach (Course fixCourse in fixCourses)
                if (DoCollide(fixCourse, result[level]))
                    return false;

            foreach (BusyTimeblock busyTimeBlock in busyTimeBlocks)
                if (DoCollide(busyTimeBlock, result[level]))
                    return false;

            return true;
        }

        private bool DoCollide(TimeBlock a, TimeBlock b)
        {
            if (a is Course && b is Course && (a as Course).Collidable && (b as Course).Collidable)
                return false;
            return a.Day == b.Day && !(a.End < b.Start || a.Start > b.End);
        }

        private bool IsValidDailyActiveTimes(List<Course> result)
        {
            int activeMinutes = 0;
            for (int i = 0; i < result.Count; i++)
            {
                if (i == 0 || result[i-1].Day != result[i].Day)
                    activeMinutes = 0;
                activeMinutes += result[i].End - result[i].Start;
                if (i == result.Count - 1 || result[i+1].Day != result[i].Day)
                {
                    DailyActiveTime boundary = dailyActiveTimes[result[i].Day];
                    if (activeMinutes < boundary.Min || activeMinutes > boundary.Max)
                        return false;
                }
            }
            return true;
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
