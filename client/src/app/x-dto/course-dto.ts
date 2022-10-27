import { CourseVm } from "../x-vm/course-vm";
import { DataTransferObject } from "./data-transfer-object";

export class CourseDto implements DataTransferObject {
    public id: string = '';
    public subjectTitle: string = '';
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

    public toVm(): CourseVm {
        let courseVM: CourseVm = new CourseVm();
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
