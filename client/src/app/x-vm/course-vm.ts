import { CourseDto } from "../x-dto/course-dto";
import { ViewModel } from "./view-model";

export class CourseVm implements ViewModel {
    public id: string = '';
    public subjectTitle: string = '';
    public code: string = '';
    public slots: number = 0;
    public day: string = '';
    public start: string = '';
    public end: string = '';
    public teachers: string = '';
    public fix: boolean = false;
    public collidable: boolean = false;
    public priority: number = 0;
    public ignored: boolean =  false;

    public copy(): CourseVm {
        return Object.assign(new CourseVm(), this);
    }

    public toDto(): CourseDto {
        let course: CourseDto = new CourseDto();
        Object.assign(course, this);

        course.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.day);

        let tmp = this.start.split(':');
        course.start = +tmp[0] * 60 + +tmp[1];

        tmp = this.end.split(':');
        course.end = +tmp[0] * 60 + +tmp[1];

        return course;
    }
}
