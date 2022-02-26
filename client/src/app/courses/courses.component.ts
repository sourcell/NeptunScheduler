import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { CourseDto } from '../x-dto/course-dto';
import { SubjectDto } from '../x-dto/subject-dto';
import { RestService } from '../rest.service';
import { CourseVm } from '../x-vm/course-vm';
import { SubjectVm } from '../x-vm/subject-vm';
import { Router } from '@angular/router';

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

    constructor(rest: RestService, router: Router) {
        super(rest, router);
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
