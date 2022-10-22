import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { SubjectDto } from '../x-dto/subject-dto';
import { RestService } from '../rest.service';
import { SubjectVm } from '../x-vm/subject-vm';
import { Router } from '@angular/router';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent extends CrudComponent<SubjectVm, SubjectDto> implements OnInit {

    public models: Array<SubjectVm> = new Array<SubjectVm>();
    public model: SubjectVm = new SubjectVm();
    public tempModel: SubjectVm = new SubjectVm();

    protected endpoint: string = '/schedule/subjects';

    constructor(rest: RestService, router: Router) {
        super(rest, router);
    }

    // public async ngOnInit(): Promise<void> {
    //     await this.fetch();
    // }

    public processGetResult(res: Array<SubjectDto>): void {
        this.models = res.map(s => Object.assign(new SubjectDto(), s).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new SubjectVm();
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
