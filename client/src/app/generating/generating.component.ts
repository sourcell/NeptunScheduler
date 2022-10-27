import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { RestService } from '../services/rest.service';
import { CourseDto } from '../x-dto/course-dto';
import { CourseVm } from '../x-vm/course-vm';

@Component({
    selector: 'app-generating',
    templateUrl: './generating.component.html',
    styleUrls: ['./generating.component.css']
})
export class GeneratingComponent extends CrudComponent<CourseVm, CourseDto> implements OnInit {

    public models: Array<CourseVm> = new Array<CourseVm>();
    public model: CourseVm = new CourseVm();
    public tempModel: CourseVm = new CourseVm();

    public isGenerating = false;

    public pageContent: Array<CourseVm> = new Array<CourseVm>();
    public pageSize: number = 0;
    public pageNumbers: Array<number> = new Array<number>();
    public pageNumber: number = 0;

    protected endpoint: string = '/schedule/generating';

    constructor(rest: RestService) {
        super(rest);

        for (let i = 1; i <= 10; i++) {
            this.pageNumbers.push(i);
        }
    }

    public override async ngOnInit(): Promise<void> {
    }

    public async generate(): Promise<void> {
        this.loading = true;
        this.isGenerating = true;

        await this.rest.get<Array<Array<CourseDto>>>('/schedule/generate')
        .then(res => {
            res.forEach(timetable => {
                timetable.forEach(course => {
                    this.models.push(Object.assign(new CourseDto(), course).toVm());
                });
            });
            this.pageSize = res[0].length;
            this.setPageNumber(1);
        })
        .catch(err => {
            if (err.status == 400) {
                this.errorMsg = err.error;
            } else {
                this.errorMsg = 'Something went wrong.';
            }
        });

        this.isGenerating = false;
        this.loading = false;
    }

    public async incPageNumber(): Promise<void> {
        if (this.pageNumber < 10) {
            this.pageNumber++;
        }
        this.setPageContent();
    }

    public async decPageNumber(): Promise<void> {
        if (this.pageNumber > 1) {
            this.pageNumber--;
        }
        this.setPageContent();
    }

    public async setPageNumber(n: number): Promise<void> {
        if (1 <= n && n <= 10) {
            this.pageNumber = n;
        }
        this.setPageContent();
    }

    public processGetResult(res: Array<CourseDto>): void {}

    public aboutToAdd(): void {}

    public processPostResult(res: CourseDto): void {}

    public processPostResults(res: CourseDto[]): void {}

    public aboutToEdit(viewModel: CourseVm): void {}

    public processPutResult(res: CourseDto): void {}

    public processDeleteResult(res: CourseDto): void {}

    private setPageContent(): void {
        const fromIdx = (this.pageNumber - 1)*this.pageSize;
        const toIdx = this.pageNumber*this.pageSize;
        this.pageContent = this.models.slice(fromIdx, toIdx);
    }

}
