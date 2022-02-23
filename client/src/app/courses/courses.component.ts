import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { DataTransferObject } from '../data-transfer-objects/data-transfer-object';
import { RestService } from '../rest.service';
import { Subject, SubjectVm } from '../subjects/subjects.component';
import { ViewModel } from '../view-models/view-model';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css']
})
export class CoursesComponent extends CrudComponent<CourseVm, CourseDto> implements OnInit {

    public models: Array<CourseVm> = new Array<CourseVm>();
    public model: CourseVm = new CourseVm();
    public tempModel: CourseVm = new CourseVm();

    public subject: SubjectVm = new SubjectVm();

    constructor(rest: RestService) {
        super(rest);
    }

    public override async ngOnInit(): Promise<void> {
        this.fetchSubject();
        await this.fetch();
    }

    public async fetchSubject(): Promise<void> {
        await this.rest.get<Subject>('', new Subject())
            .then(res => {
                res.title = 'subject name';
                const result = Object.assign(new Subject(), res);
                this.subject = result.toVm();
            })
            .catch(err => {
                this.errorMsg = 'Failed to fetch Subject.';
            });
    }

    public processGetResult(res: Array<CourseDto>): void {
        let c1 = new CourseDto();
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

        let c2 = new CourseDto();
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

        res.push(c1, c2);
        this.models = res.map(c => Object.assign(new CourseDto(), c).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new CourseVm();
    }

    public processPostResult(res: CourseDto): void {
        const result = Object.assign(new CourseDto(), res);
        this.models.push(result.toVm());
    }

    public aboutToEdit(courseVm: CourseVm): void {
        this.intention = 'edit';
        this.tempModel = courseVm;
    }

    public processPutResult(res: CourseDto): void {
        const result = Object.assign(new CourseDto(), res);
        this.models = this.models.map(c => c.id == result.id ? result.toVm() : c);
    }

    public processDeleteResult(res: CourseDto): void {
        const result = Object.assign(new CourseDto(), res);
        this.models = this.models.filter(s => s.id != result.id);
    }

}

export class CourseVm implements ViewModel {
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

export class CourseDto implements DataTransferObject {
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
