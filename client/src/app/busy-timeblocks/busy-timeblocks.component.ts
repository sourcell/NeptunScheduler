import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-busy-time-blocks',
    templateUrl: './busy-timeblocks.component.html',
    styleUrls: ['./busy-timeblocks.component.css']
})
export class BusyTimeblocksComponent implements OnInit {

    public busyTimeblocks: Array<BusyTimeblockVm> = new Array<BusyTimeblockVm>();
    public busyTimeblockToBeAdded: BusyTimeblockVm = new BusyTimeblockVm();
    public busyTimeblockToBeEdited: BusyTimeblockVm = new BusyTimeblockVm();

    public loading: boolean = false;
    public errorMsg: string = '';
    public clickedDelete: boolean = false;
    public intention: string = '';

    private readonly rest: RestService;

    constructor(rest: RestService) {
        this.rest = rest;
    }

    public async ngOnInit(): Promise<void> {
        await this.fetch();
    }

    public async fetch(): Promise<void> {
        this.loading = true;

        await this.rest.get<Array<BusyTimeblockVm>>('', new Array<BusyTimeblockVm>())
            .then(res => {
                let btb1 = new BusyTimeblockVm();
                btb1.id = 'first_id';
                btb1.day = 'Monday';
                btb1.start = '15:00';
                btb1.end = '23:59';
                let btb2 = new BusyTimeblockVm();
                btb2.id = 'second_id';
                btb2.day = 'Friday';
                btb2.start = '08:00';
                btb2.end = '10:00';

                res.push(btb1, btb2);
                this.busyTimeblocks = res.map(b => Object.assign(new BusyTimeblockVm(), b));
            })
            .catch(err => {
                this.errorMsg = 'Failed to fetch your Busy Time Blocks.';
            });

        this.loading = false;
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.busyTimeblockToBeAdded = new BusyTimeblockVm();
    }

    public async add(): Promise<void> {
        this.loading = true;

        await this.rest.post<BusyTimeblock>('', this.busyTimeblockToBeAdded.toDto())
            .then(res => {
                const result = Object.assign(new BusyTimeblock(), res);
                this.busyTimeblocks.push(result.toVm());
            })
            .catch(err => {
                this.errorMsg = 'Failed to add Busy Block.';
            });

        this.loading = false;
    }

    public aboutToEdit(busyTimeblock: BusyTimeblockVm): void {
        this.intention = 'edit';
        this.busyTimeblockToBeEdited = busyTimeblock;
    }

    public async update(): Promise<void> {
        this.loading = true;

        await this.rest.put<BusyTimeblock>('', this.busyTimeblockToBeEdited.toDto())
            .then(res => {
                const result = Object.assign(new BusyTimeblock(), res);
                this.busyTimeblocks = this.busyTimeblocks.map(b => b.id == result.id ? result.toVm() : b);
            })
            .catch(err => {
                this.errorMsg = 'Failed to edit the Busy timeblock.';
            });

        this.loading = false;
    }

    public async delete(): Promise<void> {
        this.loading = true;
        this.clickedDelete = false;

        await this.rest.delete<BusyTimeblock>('', this.busyTimeblockToBeEdited.toDto())
            .then(res => {
                const result = Object.assign(new BusyTimeblock(), res);
                this.busyTimeblocks = this.busyTimeblocks.filter(b => b.id != result.id);
            })
            .catch(err => {
                this.errorMsg = 'Failed to delete Busy timeblock.';
            });

        this.loading = false;
    }

}

export class BusyTimeblock {
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

export class BusyTimeblockVm {
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
        let res = new BusyTimeblockVm();
        res.id = this.id;
        res.day = this.day;
        res.start = this.start;
        res.end = this.end;
        return res;
    }
}
