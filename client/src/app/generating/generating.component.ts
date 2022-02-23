import { Component, OnInit } from '@angular/core';
import { Course, CourseVm } from '../courses/courses.component';
import { CrudComponent } from '../crud/crud.component';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-generating',
    templateUrl: './generating.component.html',
    styleUrls: ['./generating.component.css']
})
export class GeneratingComponent extends CrudComponent<CourseVm, Course> implements OnInit {

    public models: Array<CourseVm> = new Array<CourseVm>();
    public model: CourseVm = new CourseVm();
    public tempModel: CourseVm = new CourseVm();

    public isGenerating = false;

    public pageNumbers: Array<number> = new Array<number>();
    public pageNumber: number = 1;

    constructor(rest: RestService) {
        super(rest);

        for (let i = 1; i <= 10; i++) {
            this.pageNumbers.push(i);
        }
    }

    // public async ngOnInit(): Promise<void> {
    //     await this.fetch();
    // }

    public async generate(): Promise<void> {
        this.loading = true;
        this.isGenerating = true;

        await this.rest.get<Array<Course>>('', new Array<Course>())
        .then(res => {
            res.push(new Course());
            const result = res.map(c => Object.assign(new Course(), c).toVm());
            this.models = result;
        })
        .catch(err => {
            this.errorMsg = 'Failed to generate schedules.';
        });

        this.isGenerating = false;
        this.loading = false;
    }

    public async incPageNumber(): Promise<void> {
        if (this.pageNumber < 10) {
            this.pageNumber++;
        }
    }

    public async decPageNumber(): Promise<void> {
        if (this.pageNumber > 1) {
            this.pageNumber--;
        }
    }

    public async setPageNumber(n: number): Promise<void> {
        if (1 <= n && n <= 10) {
            this.pageNumber = n;
        }
    }

    public processGetResult(res: Array<Course>): void {}

    public aboutToAdd(): void {}

    public processPostResult(res: Course): void {}

    public aboutToEdit(viewModel: CourseVm): void {}

    public processPutResult(res: Course): void {}

    public processDeleteResult(res: Course): void {}

}
