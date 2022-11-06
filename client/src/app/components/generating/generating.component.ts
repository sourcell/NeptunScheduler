import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { ErrorResponse } from 'src/app/x-dto/error-response';
import { TimetableUnitDto } from 'src/app/x-dto/timetable-unit-dto';
import { TimetableUnitVm } from 'src/app/x-vm/timetable-unit-vm';
import { CrudComponent } from '../crud/crud.component';

@Component({
    selector: 'app-generating',
    templateUrl: './generating.component.html',
    styleUrls: ['./generating.component.css']
})
export class GeneratingComponent extends CrudComponent<TimetableUnitVm, TimetableUnitDto> implements OnInit {

    public models: Array<TimetableUnitVm> = new Array<TimetableUnitVm>();
    public model: TimetableUnitVm = new TimetableUnitVm();
    public tempModel: TimetableUnitVm = new TimetableUnitVm();

    public isGenerating = false;

    public pageContent: Array<TimetableUnitVm> = new Array<TimetableUnitVm>();
    public pageSize: number = 0;
    public pageNumbers: Array<number> = new Array<number>();
    public pageNumber: number = 0;

    conflicts: Array<TimetableUnitVm> = [];

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

        await this.rest.get<Array<Array<TimetableUnitDto>>>('/schedule/generate')
        .then(res => {
            res.forEach(timetable => {
                timetable.forEach(unit => {
                    this.models.push(Object.assign(new TimetableUnitDto(), unit).toVm());
                });
            });
            this.pageSize = res[0].length;
            this.setPageNumber(1);
        })
        .catch(err => {
            if (err.status == 400) {
                const error: ErrorResponse = err.error;
                if (error.id === 'conflict') {
                    this.conflicts = error.conflicts.map(x => Object.assign(new TimetableUnitDto(), x).toVm());
                    this.errorMsg = error.message;
                } else if (error.id === 'no-result') {
                    this.errorMsg = error.message;
                }
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

    public processGetResult(res: Array<TimetableUnitDto>): void {}

    public aboutToAdd(): void {}

    public processPostResult(res: TimetableUnitDto): void {}

    public processPostResults(res: TimetableUnitDto[]): void {}

    public aboutToEdit(viewModel: TimetableUnitVm): void {}

    public processPutResult(res: TimetableUnitDto): void {}

    public processDeleteResult(res: TimetableUnitDto): void {}

    private setPageContent(): void {
        const fromIdx = (this.pageNumber - 1)*this.pageSize;
        const toIdx = this.pageNumber*this.pageSize;
        this.pageContent = this.models.slice(fromIdx, toIdx);
    }

}
