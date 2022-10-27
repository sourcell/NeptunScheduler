import { Component } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { BusyTimeblockDto } from '../x-dto/busy-timeblock-dto';
import { RestService } from '../rest.service';
import { BusyTimeblockVm } from '../x-vm/busy-timeblock-vm';

@Component({
    selector: 'app-busy-time-blocks',
    templateUrl: './busy-timeblocks.component.html',
    styleUrls: ['./busy-timeblocks.component.css']
})
export class BusyTimeblocksComponent extends CrudComponent<BusyTimeblockVm, BusyTimeblockDto> {

    public models: Array<BusyTimeblockVm> = new Array<BusyTimeblockVm>();
    public model: BusyTimeblockVm = new BusyTimeblockVm();
    public tempModel: BusyTimeblockVm = new BusyTimeblockVm();

    protected endpoint: string = '/schedule/busytimeblocks';

    constructor(rest: RestService) {
        super(rest);
    }

    public processGetResult(res: Array<BusyTimeblockDto>): void {
        this.models = res.map(b => Object.assign(new BusyTimeblockDto(), b).toVm());
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.tempModel = new BusyTimeblockVm();
    }

    public processPostResult(res: BusyTimeblockDto): void {
        const result = Object.assign(new BusyTimeblockDto(), res);
        this.models.push(result.toVm());
    }

    public processPostResults(res: Array<BusyTimeblockDto>): void {}

    public aboutToEdit(busyTimeblock: BusyTimeblockVm): void {
        this.intention = 'edit';
        this.tempModel = busyTimeblock;
    }

    public processPutResult(res: BusyTimeblockDto): void {
        const result = Object.assign(new BusyTimeblockDto(), res);
        this.models = this.models.map(b => b.id == result.id ? result.toVm() : b);
    }

    public processDeleteResult(res: BusyTimeblockDto): void {
        this.models = this.models.filter(b => b.id != res.id);
    }

}
