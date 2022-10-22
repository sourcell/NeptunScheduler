import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { DailyActiveTimeDto } from '../x-dto/daily-active-time-dto';
import { RestService } from '../rest.service';
import { DailyActiveTimeVm } from '../x-vm/daily-active-time-vm';
import { Router } from '@angular/router';

@Component({
    selector: 'app-daily-active-times',
    templateUrl: './daily-active-times.component.html',
    styleUrls: ['./daily-active-times.component.css']
})
export class DailyActiveTimesComponent extends CrudComponent<DailyActiveTimeVm, DailyActiveTimeDto> implements OnInit {

    public models: Array<DailyActiveTimeVm> = new Array<DailyActiveTimeVm>();
    public model: DailyActiveTimeVm = new DailyActiveTimeVm();
    public tempModel: DailyActiveTimeVm = new DailyActiveTimeVm();

    protected endpoint: string = '/schedule/dailyactivetimes';

    constructor(rest: RestService, router: Router) {
        super(rest, router);
    }

    // ngOnInit(): void {
    // }

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
