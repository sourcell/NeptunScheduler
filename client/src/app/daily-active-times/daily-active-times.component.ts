import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { DataTransferObject } from '../data-transfer-objects/data-transfer-object';
import { RestService } from '../rest.service';
import { ViewModel } from '../view-models/view-model';

@Component({
    selector: 'app-daily-active-times',
    templateUrl: './daily-active-times.component.html',
    styleUrls: ['./daily-active-times.component.css']
})
export class DailyActiveTimesComponent extends CrudComponent<DailyActiveTimeVm, DailyActiveTime> implements OnInit {
    
    public models: Array<DailyActiveTimeVm> = new Array<DailyActiveTimeVm>();
    public model: DailyActiveTimeVm = new DailyActiveTimeVm();
    public tempModel: DailyActiveTimeVm = new DailyActiveTimeVm();

    constructor(rest: RestService) {
        super(rest);
    }

    // ngOnInit(): void {
    // }

    public processGetResult(res: Array<DailyActiveTime>): void {
        let x1 = new DailyActiveTime();
        x1.id = '1';
        x1.day = 1;
        x1.min = 200;
        x1.max = 400;
        let x2 = new DailyActiveTime();
        x2.id = '2';
        x2.day = 2;
        x2.min = 200;
        x2.max = 400;

        res.push(x1, x2);
        this.models = res.map(x => Object.assign(new DailyActiveTime(), x).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new DailyActiveTimeVm();
    }

    public processPostResult(res: DailyActiveTime): void {
        const result = Object.assign(new DailyActiveTime(), res);
        this.models.push(result.toVm());
    }

    public aboutToEdit(model: DailyActiveTimeVm): void {
        this.intention = 'edit';
        this.tempModel = model;
    }

    public processPutResult(res: DailyActiveTime): void {
        const result = Object.assign(new DailyActiveTime(), res);
        this.models = this.models.map(b => b.id == result.id ? result.toVm() : b);
    }

    public processDeleteResult(res: DailyActiveTime): void {
        const result = Object.assign(new DailyActiveTime(), res);
        this.models = this.models.filter(b => b.id != result.id);
    }
}

export class DailyActiveTime implements DataTransferObject {
    public id: string = '';
    public day: number = 0;
    public min: number = 0;
    public max: number = 0;

    public toVm(): DailyActiveTimeVm {
        let res: DailyActiveTimeVm = new DailyActiveTimeVm();
        Object.assign(res, this);

        res.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.day];

        return res;
    }
}

export class DailyActiveTimeVm implements ViewModel {
    public id: string = '';
    public day: string = '';
    public min: number = 0;
    public max: number = 0;

    public toDto(): DailyActiveTime {
        let res: DailyActiveTime = new DailyActiveTime();
        Object.assign(res, this);

        res.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.day);

        return res;
    }

    public copy(): DailyActiveTimeVm {
        return Object.assign(new DailyActiveTimeVm(), this);
    }
}
