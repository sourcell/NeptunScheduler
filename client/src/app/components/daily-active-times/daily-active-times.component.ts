import { Component } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { DailyActiveTimeDto } from 'src/app/x-dto/daily-active-time-dto';
import { DailyActiveTimeVm } from 'src/app/x-vm/daily-active-time-vm';
import { CrudComponent } from '../crud/crud.component';

@Component({
    selector: 'app-daily-active-times',
    templateUrl: './daily-active-times.component.html',
    styleUrls: ['./daily-active-times.component.css']
})
export class DailyActiveTimesComponent extends CrudComponent<DailyActiveTimeVm, DailyActiveTimeDto> {

    public models: Array<DailyActiveTimeVm> = new Array<DailyActiveTimeVm>();
    public model: DailyActiveTimeVm = new DailyActiveTimeVm();
    public tempModel: DailyActiveTimeVm = new DailyActiveTimeVm();

    protected endpoint: string = '/preferences/dailyactivetimes';

    constructor(rest: RestService) {
        super(rest);
    }

    public processGetResult(res: Array<DailyActiveTimeDto>): void {
        this.models = res.map(x => Object.assign(new DailyActiveTimeDto(), x).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new DailyActiveTimeVm();
    }

    public processPostResult(res: DailyActiveTimeDto): void {
        const result = Object.assign(new DailyActiveTimeDto(), res);
        this.models.push(result.toVm());
    }

    public processPostResults(res: Array<DailyActiveTimeDto>): void {}

    public aboutToEdit(model: DailyActiveTimeVm): void {
        this.intention = 'edit';
        this.tempModel = model;
    }

    public processPutResult(res: DailyActiveTimeDto): void {
        const result = Object.assign(new DailyActiveTimeDto(), res);
        this.models = this.models.map(b => b.id == result.id ? result.toVm() : b);
    }

    public processDeleteResult(res: DailyActiveTimeDto): void {
        this.models = this.models.filter(b => b.id != res.id);
    }
}
