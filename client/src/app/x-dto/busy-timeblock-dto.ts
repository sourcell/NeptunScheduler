import { BusyTimeblockVm } from "../x-vm/busy-timeblock-vm";
import { DataTransferObject } from "./data-transfer-object";

export class BusyTimeblockDto implements DataTransferObject {
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
