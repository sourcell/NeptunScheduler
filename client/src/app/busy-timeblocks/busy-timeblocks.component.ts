import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-busy-time-blocks',
    templateUrl: './busy-timeblocks.component.html',
    styleUrls: ['./busy-timeblocks.component.css']
})
export class BusyTimeblocksComponent implements OnInit {

    public busyTimeBlocks: Array<BusyTimeBlockVM> = new Array<BusyTimeBlockVM>();
    public busyTimeblockToBeAdded: BusyTimeBlockVM = new BusyTimeBlockVM();
    public busyTimeblockToBeEdited: BusyTimeBlockVM = new BusyTimeBlockVM();

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

        await this.rest.get<Array<BusyTimeBlockVM>>('', new Array<BusyTimeBlockVM>())
            .then(res => {
                let btb1 = new BusyTimeBlockVM();
                btb1.id = 'first_id';
                btb1.day = 'Monday';
                btb1.start = '15:00';
                btb1.end = '23:59';
                let btb2 = new BusyTimeBlockVM();
                btb2.id = 'second_id';
                btb2.day = 'Friday';
                btb2.start = '08:00';
                btb2.end = '10:00';

                res.push(btb1, btb2);
                this.busyTimeBlocks = res.map(b => Object.assign(new BusyTimeBlockVM(), b));
            })
            .catch(err => {
                this.errorMsg = 'Failed to fetch your Busy Time Blocks.';
            });

        this.loading = false;
    }

    public aboutToAdd(): void {
        this.intention = 'add';
        this.busyTimeblockToBeAdded = new BusyTimeBlockVM();
    }

    public async add(): Promise<void> {
        this.loading = true;

        await this.rest.post<BusyTimeBlock>('', this.busyTimeblockToBeAdded.toDto())
            .then(res => {
                const result = Object.assign(new BusyTimeBlock(), res);
                this.busyTimeBlocks.push(result.toVm());
            })
            .catch(err => {
                this.errorMsg = 'Failed to add Busy Block.';
            });

        this.loading = false;
    }

    public aboutToEdit(busyTimeblock: BusyTimeBlockVM): void {
        this.intention = 'edit';
        this.busyTimeblockToBeEdited = busyTimeblock;
    }

    public async update(): Promise<void> {
        this.loading = true;

        await this.rest.put<BusyTimeBlock>('', this.busyTimeblockToBeEdited.toDto())
            .then(res => {
                const result = Object.assign(new BusyTimeBlock(), res);
                this.busyTimeBlocks = this.busyTimeBlocks.map(b => b.id == result.id ? result.toVm() : b);
            })
            .catch(err => {
                this.errorMsg = 'Failed to edit the Busy timeblock.';
            });

        this.loading = false;
    }

}

export class BusyTimeBlock {
    public id: string = '';
    public day: number = 0;
    public start: number = 0;
    public end: number = 0;

    public toVm(): BusyTimeBlockVM {
        let res: BusyTimeBlockVM = new BusyTimeBlockVM();
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

export class BusyTimeBlockVM {
    public id: string = '';
    public day: string = '';
    public start: string = '';
    public end: string = '';

    public toDto(): BusyTimeBlock {
        let res = new BusyTimeBlock();

        Object.assign(res, this);

        res.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.day);

        let tmp = this.start.split(':');
        res.start = +tmp[0] * 60 + +tmp[1];

        tmp = this.end.split(':');
        res.end = +tmp[0] * 60 + +tmp[1];

        return res;
    }

    public copy(): BusyTimeBlockVM {
        let res = new BusyTimeBlockVM();
        res.id = this.id;
        res.day = this.day;
        res.start = this.start;
        res.end = this.end;
        return res;
    }
}
