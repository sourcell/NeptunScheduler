import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { DataTransferObject } from '../data-transfer-objects/data-transfer-object';
import { RestService } from '../rest.service';
import { ViewModel } from '../view-models/view-model';

@Component({
    selector: 'app-busy-time-blocks',
    templateUrl: './busy-timeblocks.component.html',
    styleUrls: ['./busy-timeblocks.component.css']
})
export class BusyTimeblocksComponent extends CrudComponent<BusyTimeblockVm, BusyTimeblock> implements OnInit {
    
    public models: Array<BusyTimeblockVm> = new Array<BusyTimeblockVm>();
    public model: BusyTimeblockVm = new BusyTimeblockVm();
    public tempModel: BusyTimeblockVm = new BusyTimeblockVm();

    constructor(rest: RestService) {
        super(rest);
    }

    // public async ngOnInit(): Promise<void> {
    //     await this.fetch();
    // }

    public processGetResult(res: Array<BusyTimeblock>): void {
        let btb1 = new BusyTimeblock();
        btb1.id = 'first_id';
        btb1.day = 1;
        btb1.start = 900;
        btb1.end = 1439;
        let btb2 = new BusyTimeblock();
        btb2.id = 'second_id';
        btb2.day = 5;
        btb2.start = 480;
        btb2.end = 600;

        res.push(btb1, btb2);
        this.models = res.map(b => Object.assign(new BusyTimeblock(), b).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new BusyTimeblockVm();
    }

    public processPostResult(res: BusyTimeblock): void {
        const result = Object.assign(new BusyTimeblock(), res);
        this.models.push(result.toVm());
    }

    public aboutToEdit(busyTimeblock: BusyTimeblockVm): void {
        this.intention = 'edit';
        this.tempModel = busyTimeblock;
    }

    public processPutResult(res: BusyTimeblock): void {
        const result = Object.assign(new BusyTimeblock(), res);
        this.models = this.models.map(b => b.id == result.id ? result.toVm() : b);
    }

    public processDeleteResult(res: BusyTimeblock): void {
        const result = Object.assign(new BusyTimeblock(), res);
        this.models = this.models.filter(b => b.id != result.id);
    }

}

export class BusyTimeblock implements DataTransferObject {
    public id: string = '';
    public day: number = 0;
    public start: number = 0;
    public end: number = 0;

    public toVm(): BusyTimeblockVm {
        let res: BusyTimeblockVm = new BusyTimeblockVm();
        Object.assign(res, this);

        res.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.day];

        let startHours = Math.floor(this.start / 60);
        let startMinutes = this.start - startHours * 60;
        res.start = (startHours < 10 ? '0'+startHours : startHours) + ':';
        res.start += startMinutes < 10 ? '0'+startMinutes : startMinutes;

        let endHours = Math.floor(this.end / 60);
        let endMinutes = this.end - endHours * 60;
        res.end = (endHours < 10 ? '0'+endHours : endHours) + ':';
        res.end += endMinutes < 10 ? '0'+endMinutes : endMinutes;

        return res;
    }
}

export class BusyTimeblockVm implements ViewModel {
    public id: string = '';
    public day: string = '';
    public start: string = '';
    public end: string = '';

    public toDto(): BusyTimeblock {
        let res = new BusyTimeblock();

        Object.assign(res, this);

        res.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.day);

        let tmp = this.start.split(':');
        res.start = +tmp[0] * 60 + +tmp[1];

        tmp = this.end.split(':');
        res.end = +tmp[0] * 60 + +tmp[1];

        return res;
    }

    public copy(): BusyTimeblockVm {
        return Object.assign(new BusyTimeblockVm(), this);
    }
}
