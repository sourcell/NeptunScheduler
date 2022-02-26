import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../crud/crud.component';
import { BusyTimeblockDto } from '../x-dto/busy-timeblock-dto';
import { RestService } from '../rest.service';
import { BusyTimeblockVm } from '../x-vm/busy-timeblock-vm';

@Component({
    selector: 'app-busy-time-blocks',
    templateUrl: './busy-timeblocks.component.html',
    styleUrls: ['./busy-timeblocks.component.css']
})
export class BusyTimeblocksComponent extends CrudComponent<BusyTimeblockVm, BusyTimeblockDto> implements OnInit {
    
    public models: Array<BusyTimeblockVm> = new Array<BusyTimeblockVm>();
    public model: BusyTimeblockVm = new BusyTimeblockVm();
    public tempModel: BusyTimeblockVm = new BusyTimeblockVm();

    protected endpoint: string = '/schedule/busytimeblocks';

    constructor(rest: RestService) {
        super(rest);
    }

    // public async ngOnInit(): Promise<void> {
    //     await this.fetch();
    // }

    public processGetResult(res: Array<BusyTimeblockDto>): void {
        let btb1 = new BusyTimeblockDto();
        btb1.id = 'first_id';
        btb1.day = 1;
        btb1.start = 900;
        btb1.end = 1439;
        let btb2 = new BusyTimeblockDto();
        btb2.id = 'second_id';
        btb2.day = 5;
        btb2.start = 480;
        btb2.end = 600;

        res.push(btb1, btb2);
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
