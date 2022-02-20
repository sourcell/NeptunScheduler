import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-busy-time-blocks',
    templateUrl: './busy-time-blocks.component.html',
    styleUrls: ['./busy-time-blocks.component.css']
})
export class BusyTimeBlocksComponent implements OnInit {

    public busyTimeBlocks: Array<BusyTimeBlockVM> = new Array<BusyTimeBlockVM>();

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
                btb1.day = 'Monday';
                btb1.start = '15:00';
                btb1.end = '24:00';
                let btb2 = new BusyTimeBlockVM();
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

}

export class BusyTimeBlock {
    public day: number = 0;
    public start: number = 0;
    public end: number = 0;
}

export class BusyTimeBlockVM {
    public day: string = '';
    public start: string = '';
    public end: string = '';
}
