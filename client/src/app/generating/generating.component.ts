import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { CourseDto } from '../x-dto/course-dto';
import { RestService } from '../rest.service';
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

    public pageNumbers: Array<number> = new Array<number>();
    public pageNumber: number = 1;

    protected endpoint: string = '/schedule/generating';

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

        await this.rest.get<Array<CourseDto>>('', new Array<CourseDto>())
        .then(res => {
            res.push(new CourseDto());
            const result = res.map(c => Object.assign(new CourseDto(), c).toVm());
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

    public processGetResult(res: Array<CourseDto>): void {}

    public aboutToAdd(): void {}

    public processPostResult(res: CourseDto): void {}

    public aboutToEdit(viewModel: CourseVm): void {}

    public processPutResult(res: CourseDto): void {}

    public processDeleteResult(res: string): void {}

}
