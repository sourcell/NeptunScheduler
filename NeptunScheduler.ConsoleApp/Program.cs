using System;
using System.Collections.Generic;
using NeptunScheduler.Scheduler;

namespace NeptunScheduler.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            // SUBJECT #1
            List<Course> courses1 = new List<Course>()
            {
                new Course() { SubjectName = "Tárgy #1", Day = 1, Fix = true, Start = new Time(8, 0), End = new Time(9, 30) },

                new Course() { SubjectName = "Tárgy #1", Day = 2, Fix = false, Start = new Time(8, 0), End = new Time(9, 30) },
                new Course() { SubjectName = "Tárgy #1", Day = 3, Fix = false, Start = new Time(8, 0), End = new Time(9, 30) }
            };
            Subject subject1 = new Subject() { Title = "Tárgy #1", Courses = courses1 };

            // SUBJECT #2
            List<Course> courses2 = new List<Course>()
            {
                new Course() { SubjectName = "Tárgy #2", Day = 1, Fix = true, Start = new Time(10, 0), End = new Time(11, 30) },

                new Course() { SubjectName = "Tárgy #2", Day = 2, Fix = false, Start = new Time(9, 0), End = new Time(11, 30) },
                new Course() { SubjectName = "Tárgy #2", Day = 3, Fix = false, Start = new Time(10, 0), End = new Time(11, 30) }
            };
            Subject subject2 = new Subject() { Title = "Tárgy #2", Courses = courses2 };

            // SUBJECT #3
            List<Course> courses3 = new List<Course>()
            {
                new Course() { SubjectName = "Tárgy #3", Day = 1, Fix = true, Start = new Time(12, 0), End = new Time(13, 30) },

                new Course() { SubjectName = "Tárgy #3", Day = 2, Fix = false, Start = new Time(12, 0), End = new Time(13, 30) },
                new Course() { SubjectName = "Tárgy #3", Day = 3, Fix = false, Start = new Time(12, 0), End = new Time(13, 30) }
            };
            Subject subject3 = new Subject() { Title = "Tárgy #3", Courses = courses3 };

            // SUBJECT #4
            List<Course> courses4 = new List<Course>()
            {
                new Course() { SubjectName = "Tárgy #4", Day = 4, Fix = true, Start = new Time(8, 0), End = new Time(9, 30) },

                new Course() { SubjectName = "Tárgy #4", Day = 4, Fix = false, Start = new Time(10, 0), End = new Time(11, 30) },
            };
            Subject subject4 = new Subject() { Title = "Tárgy #4", Courses = courses4 };

            List<Subject> subjects = new List<Subject>();
            subjects.Add(subject1);
            subjects.Add(subject2);
            subjects.Add(subject3);
            subjects.Add(subject4);

            List<BusyTimeBlock> busies = new List<BusyTimeBlock>();
            // busies.Add(new BusyTimeBlock() { Day = 3, Start = new Time(13, 0), End = new Time(13, 10) });

            Backtracking bt = new Backtracking(subjects, busies);

            List<List<Course>> results = bt.PossibleResults();
            
            Console.ForegroundColor = ConsoleColor.Green;
            System.Console.WriteLine($"Number of possible results: {results.Count}\n");
            Console.ResetColor();

            foreach (List<Course> res in results)
            {
                foreach (Course course in res)
                {
                    System.Console.WriteLine(course);
                }
                System.Console.WriteLine("-----------------------------------------");
                Console.ReadLine();
            }
        }
    }
}
