import { Component, OnInit } from '@angular/core';

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

    constructor() { }

    public ngOnInit(): void {
    }

    public reset(): void {
        this.subjectToBeAdded = new Subject();
    }

    public async addSubject(): Promise<void> {
        this.loading = true;

        // HTTP POST -> result: added Subject
        await new Promise(r => setTimeout(r, 1000));
        let result = this.subjectToBeAdded;
        // ---

        this.subjects.push(result);

        this.loading = false;
    }

    public async updateSubject(): Promise<void> {
        this.loading = true;

        // HTTP PUT -> result: updated Subject
        await new Promise(r => setTimeout(r, 1000));
        let result = this.subjectToBeEdited;
        // ---

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
