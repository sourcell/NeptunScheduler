import { Component } from '@angular/core';
import { NeptunSerivceOptions, NeptunService } from 'src/app/services/neptun.service';
import { RestService } from 'src/app/services/rest.service';
import { XlsxService } from 'src/app/services/xlsx.service';
import { CourseDto } from 'src/app/x-dto/course-dto';
import { SubjectDto } from 'src/app/x-dto/subject-dto';
import { SubjectVm } from 'src/app/x-vm/subject-vm';
import { CrudComponent } from '../crud/crud.component';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent extends CrudComponent<SubjectVm, SubjectDto> {

    public models: Array<SubjectVm> = new Array<SubjectVm>();
    public model: SubjectVm = new SubjectVm();
    public tempModel: SubjectVm = new SubjectVm();

    neptunUsername: string = '';
    neptunPassword: string = '';
    neptunCodes: string = '';

    protected endpoint: string = '/subjects';

    constructor(
        rest: RestService,
        private readonly neptunService: NeptunService,
        private readonly xlsxService: XlsxService) {
            super(rest);
    }

    public processGetResult(res: Array<SubjectDto>): void {
        this.models = res.map(s => Object.assign(new SubjectDto(), s).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new SubjectVm();
    }

    public async importFromFiles(files: FileList | null): Promise<void> {
        this.loading = true;
        const fileNames = this.xlsxService.getFileNames(files);
        const subjects = fileNames.map(name => {
            const subject = new SubjectDto();
            subject.title = name;
            return subject;
        });
        const newSubjects = await this.rest.post<Array<SubjectDto>>('/subjects/all', subjects);
        for (const subject of newSubjects) {
            const courses = await this.xlsxService.importCoursesByFileName(files, subject.title);
            await this.rest.post<Array<CourseDto>>('/subjects/' + subject.id + '/courses/all', courses);
        }
        this.models = this.models.concat(newSubjects.map(subject => Object.assign(new SubjectDto(), subject).toVm()));
        this.loading = false;
    }

    public async importViaNeptun(): Promise<void> {
        this.loading = true;
        const options: NeptunSerivceOptions = {
            username: this.neptunUsername,
            password: this.neptunPassword,
            neptunCodes: this.neptunCodes.split(' ')
        };
        const result = await this.neptunService.importViaNeptun(options);
        const newSubjects = await this.rest.post<Array<SubjectDto>>('/subjects/all', result.subjects);
        for (const subject of newSubjects) {
            const courses = result.courses.filter(course => course.subjectTitle === subject.title);
            await this.rest.post<Array<CourseDto>>('/subjects/' + subject.id + '/courses/all', courses);
        }
        this.models = this.models.concat(newSubjects.map(subject => Object.assign(new SubjectDto(), subject).toVm()));
        this.loading = false;
    }

    public processPostResult(res: SubjectDto): void {
        const result = Object.assign(new SubjectDto(), res);
        this.models.push(result.toVm());
    }

    public processPostResults(res: SubjectDto[]): void {}

    public aboutToEdit(subjectVm: SubjectVm): void {
        this.intention = 'edit';
        this.tempModel = subjectVm;
    }

    public processPutResult(res: SubjectDto): void {
        const result = Object.assign(new SubjectDto(), res);
        this.models = this.models.map(s => s.id == res.id ? result.toVm() : s);
    }

    public processDeleteResult(res: SubjectDto): void {
        this.models = this.models.filter(s => s.id != res.id);
    }

}
