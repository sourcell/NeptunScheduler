import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { CourseDto } from '../x-dto/course-dto';
import { SubjectDto } from '../x-dto/subject-dto';
import { RestService } from '../rest.service';
import { CourseVm } from '../x-vm/course-vm';
import { SubjectVm } from '../x-vm/subject-vm';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

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
    public notAllAdded = false;

    protected endpoint: string;
    private route: ActivatedRoute;
    private subjectId: string;

    constructor(rest: RestService, router: Router, route: ActivatedRoute) {
        super(rest, router);
        this.route = route;

        this.subjectId = this.route.snapshot.paramMap.get('id')!;
        this.endpoint = '/schedule/subjects/' + this.subjectId + '/courses';
    }

    public override async ngOnInit(): Promise<void> {
        this.fetchSubject();
        this.getCourses();
    }

    public async fetchSubject(): Promise<void> {
        await this.rest._get<SubjectDto>('/schedule/subjects/' + this.subjectId)
            .then(res => {
                const result = Object.assign(new SubjectDto(), res);
                this.subject = result.toVm();
            })
            .catch(err => {
                this.errorMsg = 'Failed to fetch Subject.';
            });
    }

    public getCourses(): void {
        this.endpoint = '/schedule/subjects/' + this.subjectId + '/courses';
        this.fetch();
    }

    public processGetResult(res: Array<CourseDto>): void {
        this.models = res.map(c => Object.assign(new CourseDto(), c).toVm());
    }

    public aboutToAdd(): void {
        this.endpoint = '/schedule/subjects/' + this.subjectId + '/courses';
        this.intention = 'add';
        this.tempModel = new CourseVm();
    }

    public aboutToAddAll(): void {
        this.endpoint = '/schedule/subjects/' + this.subjectId + '/courses/all';
        this.intention = 'add';
    }

    public async addCoursesViaXlsx(files: FileList | null) {
        const file = files?.item(0);
        const data = await file?.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: Array<any> = XLSX.utils.sheet_to_json(worksheet);
        const models: Array<CourseDto> = [];
        rows.forEach(row => {
            this.tempModel.code = row['Kurzus kódja'];
            const slotsData = row['Fő/Várólista/Limit'].split('/');
            this.tempModel.slots = +slotsData[2] - +slotsData[0];
            const dayCodes = ['V', 'H', 'K', 'SZE', 'CS', 'P', 'SZO'];
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const fullTimeData = row['Órarend infó'];
            const timeData: string = fullTimeData.slice(0, fullTimeData.indexOf(' '));
            if (timeData !== '') {
                const endOfDay = timeData.indexOf(':');
                const dayCode = timeData.slice(0, endOfDay);
                this.tempModel.day = dayNames[dayCodes.indexOf(dayCode)];
                this.tempModel.start = timeData.slice(endOfDay + 1, endOfDay + 6);
                this.tempModel.end = timeData.slice(endOfDay + 7, endOfDay + 12);
                this.tempModel.teachers = row['Oktatók'];
                this.tempModel.fix = row['Kurzus típusa'] === 'Elmélet';
                models.push(this.tempModel.toDto());
            } else {
                this.notAllAdded = true;
            }
        });
        this.tempModel = new CourseVm();
        this.addAll(models);
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
        this.endpoint = '/schedule/courses';
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
