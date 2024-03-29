import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { ActivatedRoute } from '@angular/router';
import { CourseVm } from 'src/app/x-vm/course-vm';
import { CourseDto } from 'src/app/x-dto/course-dto';
import { SubjectVm } from 'src/app/x-vm/subject-vm';
import { RestService } from 'src/app/services/rest.service';
import { XlsxService } from 'src/app/services/xlsx.service';
import { SubjectDto } from 'src/app/x-dto/subject-dto';

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
    public importWarning = false;

    protected endpoint: string;
    private subjectId: string;

    constructor(
        rest: RestService,
        private readonly route: ActivatedRoute,
        private readonly xlsxService: XlsxService) {
            super(rest);
            this.subjectId = this.route.snapshot.paramMap.get('id')!;
            this.endpoint = '/subjects/' + this.subjectId + '/courses';
    }

    public override async ngOnInit(): Promise<void> {
        this.fetchSubject();
        this.getCourses();
    }

    public async fetchSubject(): Promise<void> {
        await this.rest.get<SubjectDto>('/subjects/' + this.subjectId)
            .then(res => {
                const result = Object.assign(new SubjectDto(), res);
                this.subject = result.toVm();
            })
            .catch(err => {
                this.errorMsg = 'Failed to fetch Subject.';
            });
    }

    public getCourses(): void {
        this.endpoint = '/subjects/' + this.subjectId + '/courses';
        this.fetch();
    }

    public processGetResult(res: Array<CourseDto>): void {
        this.models = res.map(c => Object.assign(new CourseDto(), c).toVm());
    }

    public aboutToAdd(): void {
        this.endpoint = '/subjects/' + this.subjectId + '/courses';
        this.intention = 'add';
        this.tempModel = new CourseVm();
    }

    public aboutToAddAll(): void {
        this.endpoint = '/subjects/' + this.subjectId + '/courses/all';
        this.intention = 'add';
    }

    public async addCoursesViaXlsx(files: FileList | null): Promise<void> {
        const file = files?.item(0);
        if (!file) {
            return;
        }
        const models = await this.xlsxService.importCourses(file);
        this.addAll(models);
        this.importWarning = true;
    }

    public processPostResult(res: CourseDto): void {
        const result = Object.assign(new CourseDto(), res);
        this.models.push(result.toVm());
    }

    public processPostResults(res: Array<CourseDto>): void {
        res.forEach(dto => {
            this.processPostResult(dto);
        });
    }

    public aboutToEdit(courseVm: CourseVm): void {
        this.endpoint = '/courses';
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

    public async removeAllCourses(): Promise<void> {
        this.loading = true;
        const courseIds = this.models.map(course => course.id);
        await this.rest.deleteModel<Array<string>>('/courses', courseIds);
        this.models = [];
        this.loading = false;
    }

}
