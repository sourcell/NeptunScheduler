import { Component, OnInit } from '@angular/core';
import { Course, CourseVm } from '../courses/courses.component';
import { CrudComponent } from '../crud/crud.component';
import { DataTransferObject } from '../data-transfer-objects/data-transfer-object';
import { RestService } from '../rest.service';
import { ViewModel } from '../view-models/view-model';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent extends CrudComponent<SubjectVm, Subject> implements OnInit {

    public models: Array<SubjectVm> = new Array<SubjectVm>();
    public model: SubjectVm = new SubjectVm();
    public tempModel: SubjectVm = new SubjectVm();

    constructor(rest: RestService) {
        super(rest);
    }

    // public async ngOnInit(): Promise<void> {
    //     await this.fetch();
    // }

    public processGetResult(res: Array<Subject>): void {
        let x = new Subject();
        x.id = 'some_id';
        x.title = 'simulated result from the server';
        x.credits = 4;
        res.push(x);
        this.models = res.map(s => Object.assign(new Subject(), s).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new SubjectVm();
    }

    public processPostResult(res: Subject): void {
        const result = Object.assign(new Subject(), res);
        this.models.push(result.toVm());
    }

    public aboutToEdit(subjectVm: SubjectVm): void {
        this.intention = 'edit';
        this.tempModel = subjectVm;
    }

    public processPutResult(res: Subject): void {
        const result = Object.assign(new Subject(), res);
        this.models = this.models.map(s => s.id == res.id ? result.toVm() : s);
    }

    public processDeleteResult(res: Subject): void {
        const result = Object.assign(new Subject(), res);
        this.models = this.models.filter(s => s.id != result.id);
    }

}

export class Subject implements DataTransferObject {
    public id: string = '';
    public title: string = '';
    public credits: number = 0;
    public courses: Array<Course> = new Array<Course>();

    public toVm(): SubjectVm {
        let vm = Object.assign(new SubjectVm(), this);
        vm.courses = this.courses.map(c => Object.assign(new CourseVm(), c));;
        return vm;
    }
}

export class SubjectVm implements ViewModel {
    public id: string = '';
    public title: string = '';
    public credits: number = 0;
    public courses: Array<CourseVm> = new Array<CourseVm>();

    public copy(): SubjectVm {
        return Object.assign(new SubjectVm(), this);
    }

    public toDto(): Subject {
        let dto = Object.assign(new Subject(), this);
        dto.courses = this.courses.map(c => Object.assign(new Course(), c));;
        return dto;
    }
}
