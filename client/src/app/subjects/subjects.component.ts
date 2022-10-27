import { Component } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { SubjectDto } from '../x-dto/subject-dto';
import { SubjectVm } from '../x-vm/subject-vm';
import { XlsxService } from '../services/xlsx.service';
import { CourseDto } from '../x-dto/course-dto';
import { RestService } from '../services/rest.service';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent extends CrudComponent<SubjectVm, SubjectDto> {

    public models: Array<SubjectVm> = new Array<SubjectVm>();
    public model: SubjectVm = new SubjectVm();
    public tempModel: SubjectVm = new SubjectVm();

    protected endpoint: string = '/schedule/subjects';

    constructor(
        rest: RestService,
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
        const newSubjects = await this.rest._post<Array<SubjectDto>>('/schedule/subjects/all', subjects);
        for (const subject of newSubjects) {
            const courses = await this.xlsxService.importCoursesByFileName(files, subject.title);
            await this.rest._post<Array<CourseDto>>('/schedule/subjects/' + subject.id + '/courses/all', courses);
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
