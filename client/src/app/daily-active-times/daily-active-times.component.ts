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
export class DailyActiveTimesComponent extends CrudComponent<DailyActiveTimeVm, DailyActiveTimeDto> implements OnInit {
    
    public models: Array<DailyActiveTimeVm> = new Array<DailyActiveTimeVm>();
    public model: DailyActiveTimeVm = new DailyActiveTimeVm();
    public tempModel: DailyActiveTimeVm = new DailyActiveTimeVm();

    constructor(rest: RestService) {
        super(rest);
    }

    // ngOnInit(): void {
    // }

    public processGetResult(res: Array<DailyActiveTimeDto>): void {
        let x1 = new DailyActiveTimeDto();
        x1.id = '1';
        x1.day = 1;
        x1.min = 200;
        x1.max = 400;
        let x2 = new DailyActiveTimeDto();
        x2.id = '2';
        x2.day = 2;
        x2.min = 200;
        x2.max = 400;

        res.push(x1, x2);
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

    public aboutToEdit(model: DailyActiveTimeVm): void {
        this.intention = 'edit';
        this.tempModel = model;
    }

    public processPutResult(res: DailyActiveTimeDto): void {
        const result = Object.assign(new DailyActiveTimeDto(), res);
        this.models = this.models.map(b => b.id == result.id ? result.toVm() : b);
    }

    public processDeleteResult(res: DailyActiveTimeDto): void {
        const result = Object.assign(new DailyActiveTimeDto(), res);
        this.models = this.models.filter(b => b.id != result.id);
    }
}

export class DailyActiveTimeDto implements DataTransferObject {
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

    public toDto(): DailyActiveTimeDto {
        let res: DailyActiveTimeDto = new DailyActiveTimeDto();
        Object.assign(res, this);

        res.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.day);

        return res;
    }

    public copy(): DailyActiveTimeVm {
        return Object.assign(new DailyActiveTimeVm(), this);
    }
}
