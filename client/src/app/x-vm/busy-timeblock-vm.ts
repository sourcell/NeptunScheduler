import { BusyTimeblockDto } from "../x-dto/busy-timeblock-dto";
import { ViewModel } from "./view-model";

export class BusyTimeblockVm implements ViewModel {
    public id: string = '';
    public title: string = '';
    public day: string = '';
    public start: string = '';
    public end: string = '';

    public toDto(): BusyTimeblockDto {
        let res = new BusyTimeblockDto();
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
