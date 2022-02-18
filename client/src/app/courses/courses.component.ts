import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Subject } from '../subjects/subjects.component';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

    public subject: Subject = new Subject();
    public courseToBeAdded: CourseVM = new CourseVM();
    public courseToBeEdited: CourseVM = new CourseVM();

    public loading: boolean = false;
    public errorMsg: string = '';
    public clickedDelete: boolean = false;
    public intention: string = '';

    private readonly rest: RestService;

    constructor(rest: RestService) {
        this.rest = rest;
    }

    public async ngOnInit(): Promise<void> {
        await this.fetchSubject();
    }

    public async fetchSubject(): Promise<void> {
        this.loading = true;

        await this.rest.get<Subject>('', new Subject())
            .then(res => {
                // Objects for testing
                res.id = 'subject_id';
                res.title = 'simulated result from the server';

                let c1 = new Course();
                c1.id = 'id1';
                c1.code = 'ABC-123';
                c1.slots = 4;
                c1.day = 1;
                c1.start = 480;
                c1.end = 580;
                c1.teachers = 'Valaki Sanyi';
                c1.fix = true;
                c1.collidable = false;
                c1.ignored = false;
                c1.priority = 5;

                let c2 = new Course();
                c2.id = 'id2';
                c2.code = 'XZY-456';
                c2.slots = 2;
                c2.day = 2;
                c2.start = 630;
                c2.end = 720;
                c2.teachers = 'Simon Péter';
                c2.fix = false;
                c2.collidable = true;
                c2.ignored = true;
                c2.priority = 10;

                res.courses.push(c1);
                res.courses.push(c2);
                // ----

                this.subject = Object.assign(new Subject(), res);
                this.subject.courses = this.subject.courses.map(c => Object.assign(new Course(), c));
            })
            .catch(err => {
                this.errorMsg = 'Failed to load Courses.'
            });

        this.loading = false;
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.courseToBeAdded = new CourseVM();
    }

    public async addCourse(): Promise<void> {
        this.loading = true;

        // HTTP POST -> result: added Course
        await this.rest.post<Course>('', this.courseToBeAdded.getCourse())
            .then(res => {
                const result = Object.assign(new Course(), res);
                this.subject.courses.push(result);
            })
            .catch(err => {
                this.errorMsg = 'Failed to add Course.';
            });

        this.loading = false;
    }

    public aboutToEdit(course: Course): void {
        this.intention = 'edit';
        this.courseToBeEdited = course.getCourseVM();
    }

    public async updateCourse(): Promise<void> {
        this.loading = true;

        // HTTP PUT -> result: edited Course
        await this.rest.put<Course>('', this.courseToBeEdited.getCourse())
            .then(res => {
                const result = Object.assign(new Course(), res);
                this.subject.courses = this.subject.courses.map(c => c.id == result.id ? result : c);
            })
            .catch(err => {
                this.errorMsg = 'Failed to edit the Course.';
            });

        this.loading = false;
    }

    public async delete(): Promise<void> {
        this.loading = true;
        this.clickedDelete = false;

        // HTTP DELETE -> result: deleted Course
        await this.rest.delete<Course>('', this.courseToBeEdited.getCourse())
            .then(res => {
                const result = Object.assign(new Course(), res);
                this.subject.courses = this.subject.courses.filter(c => c.id != result.id);
            })
            .catch(err => {
                this.errorMsg = 'Failed to delete Subject.'
            });

        this.loading = false;
    }

}

export class CourseVM {
    public id: string = '';
    public code: string = '';
    public slots: number = 0;
    public day: string = '';    // string because of the input form
    public start: string = '';  // string because of the input form
    public end: string = '';    // string because of the input form
    public teachers: string = '';
    public fix: boolean = false;
    public collidable: boolean = false;
    public priority: number = 0;
    public ignored: boolean =  false;

    public getCourse(): Course {
        let course: Course = new Course();
        Object.assign(course, this);

        course.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.day);

        let tmp = this.start.split(':');
        course.start = +tmp[0] * 60 + +tmp[1];

        tmp = this.end.split(':');
        course.end = +tmp[0] * 60 + +tmp[1];

        return course;
    }
}

export class Course {
    public id: string = '';
    public code: string = '';
    public slots: number = 0;
    public day: number = 0;
    public start: number = 0;
    public end: number = 0;
    public teachers: string = '';
    public fix: boolean = false;
    public collidable: boolean = false;
    public priority: number = 0;
    public ignored: boolean =  false;

    public getCourseVM(): CourseVM {
        let courseVM: CourseVM = new CourseVM();
        Object.assign(courseVM, this);

        courseVM.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.day];

        let startHours = Math.floor(this.start / 60);
        let startMinutes = this.start - startHours * 60;
        courseVM.start = (startHours < 10 ? '0'+startHours : startHours) + ':';
        courseVM.start += startMinutes < 10 ? '0'+startMinutes : startMinutes;

        let endHours = Math.floor(this.end / 60);
        let endMinutes = this.end - endHours * 60;
        courseVM.end = (endHours < 10 ? '0'+endHours : endHours) + ':';
        courseVM.end += endMinutes < 10 ? '0'+endMinutes : endMinutes;

        return courseVM;
    }
}
