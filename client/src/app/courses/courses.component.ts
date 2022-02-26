import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { CourseDto } from '../x-dto/course-dto';
import { SubjectDto } from '../x-dto/subject-dto';
import { RestService } from '../rest.service';
import { CourseVm } from '../x-vm/course-vm';
import { SubjectVm } from '../x-vm/subject-vm';

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

    protected endpoint: string = '/schedule/courses';

    constructor(rest: RestService) {
        super(rest);
    }

    public override async ngOnInit(): Promise<void> {
        this.fetchSubject();
        await this.fetch();
    }

    public async fetchSubject(): Promise<void> {
        await this.rest.get<SubjectDto>('', new SubjectDto())
            .then(res => {
                res.title = 'subject name';
                const result = Object.assign(new SubjectDto(), res);
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
        this.models = this.models.filter(s => s.id != res.id);
    }

}
