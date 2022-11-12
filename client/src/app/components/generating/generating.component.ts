import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { ErrorResponse } from 'src/app/x-dto/error-response';
import { ScheduleUnitDto } from 'src/app/x-dto/schedule-unit-dto';
import { ScheduleUnitVm } from 'src/app/x-vm/schedule-unit-vm';
import { CrudComponent } from '../crud/crud.component';

@Component({
    selector: 'app-generating',
    templateUrl: './generating.component.html',
    styleUrls: ['./generating.component.css']
})
export class GeneratingComponent extends CrudComponent<ScheduleUnitVm, ScheduleUnitDto> implements OnInit {

    public models: Array<ScheduleUnitVm> = new Array<ScheduleUnitVm>();
    public model: ScheduleUnitVm = new ScheduleUnitVm();
    public tempModel: ScheduleUnitVm = new ScheduleUnitVm();

    public isGenerating = false;

    public pageContent: Array<ScheduleUnitVm> = new Array<ScheduleUnitVm>();
    public pageSize: number = 0;
    public pageNumbers: Array<number> = new Array<number>();
    public pageNumber: number = 0;

    conflicts: Array<ScheduleUnitVm> = [];

    protected endpoint: string = '/schedule/generating';

    constructor(rest: RestService) {
        super(rest);
    }

    public override async ngOnInit(): Promise<void> {
    }

    public async generate(): Promise<void> {
        this.loading = true;
        this.isGenerating = true;
        let numberOfPages = 0;

        await this.rest.get<Array<Array<ScheduleUnitDto>>>('/schedule/generate')
        .then(res => {
            res.forEach(timetable => {
                timetable.forEach(unit => {
                    this.models.push(Object.assign(new ScheduleUnitDto(), unit).toVm());
                });
            });
            this.pageSize = res[0].length;
            numberOfPages = res.length;
            this.setPageNumber(1);
        })
        .catch(err => {
            if (err.status == 400) {
                const error: ErrorResponse = err.error;
                if (error.id === 'conflict') {
                    this.conflicts = error.conflicts.map(x => Object.assign(new ScheduleUnitDto(), x).toVm());
                    this.errorMsg = error.message;
                } else if (error.id === 'no-result') {
                    this.errorMsg = error.message;
                }
            } else {
                this.errorMsg = 'Something went wrong.';
            }
        });

        for (let i = 1; i <= numberOfPages; i++) {
            this.pageNumbers.push(i);
        }

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

    public processGetResult(res: Array<ScheduleUnitDto>): void {}

    public aboutToAdd(): void {}

    public processPostResult(res: ScheduleUnitDto): void {}

    public processPostResults(res: ScheduleUnitDto[]): void {}

    public aboutToEdit(viewModel: ScheduleUnitVm): void {}

    public processPutResult(res: ScheduleUnitDto): void {}

    public processDeleteResult(res: ScheduleUnitDto): void {}

    private setPageContent(): void {
        const fromIdx = (this.pageNumber - 1)*this.pageSize;
        const toIdx = this.pageNumber*this.pageSize;
        this.pageContent = this.models.slice(fromIdx, toIdx);
    }

}
