import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

    public subjects: Array<Subject> = new Array<Subject>();
    public subjectToBeAdded: Subject = new Subject();
    public subjectToBeEdited: Subject = new Subject();

    public loading: boolean = false;

    private readonly rest: RestService;

    constructor(rest: RestService) {
        this.rest = rest;
    }

    public async ngOnInit(): Promise<void> {
        await this.rest.get<Array<Subject>>('', this.subjects)
            .then(res => {
                let x = new Subject();
                x.id = 'some_id';
                x.title = 'simulated result from the server';
                x.credits = 4;
                res.push(x);
                this.subjects.map(s => Object.assign(new Subject(), res));
            })
            .catch(err => {
                this.errorMsg = 'Failed to load Subjects.'
            });

        this.loading = false;
    }

    public reset(): void {
        this.subjectToBeAdded = new Subject();
    }

    public async addSubject(): Promise<void> {
        this.loading = true;

        // HTTP POST -> result: added Subject
        await this.rest.post<Subject>('', this.subjectToBeAdded)
            .then(res => {
                let result = new Subject();
                Object.assign(result, res);
                this.subjects.push(result);
            })
            .catch(err => {
                this.errorMsg = 'Failed to add the Subject.';
            });

        this.loading = false;
    }

    public async updateSubject(): Promise<void> {
        this.loading = true;

        // HTTP PUT -> result: updated Subject
        await this.rest.put<Subject>('', this.subjectToBeEdited)
            .then(res => {
                let result = new Subject();
                Object.assign(result, res);
                this.subjects = this.subjects.map(s => s.id == result.id ? result : s);
            })
            .catch(err => {
                this.errorMsg = 'Failed to edit the Subject.';
            });

        this.subjects = this.subjects.map(s => s.id == result.id ? result : s);

        this.loading = false;
    }

}

export class Subject {
    public id: string = '';
    public title: string = '';
    public credits: number = 0;

    public copy(): Subject {
        let res = new Subject();
        res.id = this.id;
        res.title = this.title;
        res.credits = this.credits;
        return res;
    }
}
