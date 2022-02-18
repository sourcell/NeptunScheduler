import { Component, OnInit } from '@angular/core';
import { Course } from '../courses/courses.component';
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
    public errorMsg: string = '';
    public clickedDelete: boolean = false;
    public intention: string = '';

    private readonly rest: RestService;

    constructor(rest: RestService) {
        this.rest = rest;
    }

    public async ngOnInit(): Promise<void> {
        await this.fetchSubjects();
    }

    public async fetchSubjects(): Promise<void> {
        this.loading = true;

        await this.rest.get<Array<Subject>>('', new Array<Subject>())
            .then(res => {
                let x = new Subject();
                x.id = 'some_id';
                x.title = 'simulated result from the server';
                x.credits = 4;
                res.push(x);
                this.subjects = res.map(s => Object.assign(new Subject(), s));
            })
            .catch(err => {
                this.errorMsg = 'Failed to load Subjects.'
            });

        this.loading = false;
    }

    public aboutToAdd(): void {
        this.intention = 'add';
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

    public aboutToEdit(subject: Subject): void {
        this.intention = 'edit';
        this.subjectToBeEdited = subject;
    }

    public async updateSubject(): Promise<void> {
        this.loading = true;

        // HTTP PUT -> result: updated Subject
        await this.rest.put<Subject>('', this.subjectToBeEdited)
            .then(res => {
                const result = Object.assign(new Subject(), res);
                this.subjects = this.subjects.map(s => s.id == result.id ? result : s);
            })
            .catch(err => {
                this.errorMsg = 'Failed to edit the Subject.';
            });

        this.loading = false;
    }

    public async delete(): Promise<void> {
        this.loading = true;
        this.clickedDelete = false;

        // HTTP DELETE -> result: deleted Subject
        await this.rest.delete<Subject>('', this.subjectToBeEdited)
            .then(res => {
                let result = new Subject();
                Object.assign(result, res);
                this.subjects = this.subjects.filter(s => s.id != result.id);
            })
            .catch(err => {
                this.errorMsg = 'Failed to delete Subject.'
            });

        this.loading = false;
    }

}

export class Subject {
    public id: string = '';
    public title: string = '';
    public credits: number = 0;
    public courses: Array<Course> = new Array<Course>();

    public copy(): Subject {
        let res = new Subject();
        res.id = this.id;
        res.title = this.title;
        res.credits = this.credits;
        return res;
    }
}
