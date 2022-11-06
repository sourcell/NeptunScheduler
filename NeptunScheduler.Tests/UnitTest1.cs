using System.Collections.Generic;
using NeptunScheduler.Models;
using NeptunScheduler.Scheduler;
using Xunit;

namespace NeptunScheduler.Tests;

public class UnitTest1
{
    [Fact]
    public void WastedMinutes_Should_Work()
    {
        // ARRANGE
        List<Subject> subjects = new List<Subject>();
        List<BusyTimeblock> busies = new List<BusyTimeblock>();
        List<DailyActiveTime> dailyActiveTimes = new List<DailyActiveTime>();
        Backtracking bt = new Backtracking(subjects, busies, dailyActiveTimes);
        List<Course> courses = new List<Course>();
        courses.Add(new Course() {
            Day = 1,
            Start = 100,
            End = 190
        });
        courses.Add(new Course() {
            Day = 1,
            Start = 200,
            End = 300
        });
        courses.Add(new Course() {
            Day = 2,
            Start = 310,
            End = 400
        });

        // ACT
        int result = bt.WastedMinutes(courses);

        // ASSERT
        Assert.Equal(10, result);
    }
}
