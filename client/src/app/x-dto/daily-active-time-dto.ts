import { DailyActiveTimeVm } from "../x-vm/daily-active-time-vm";
import { DataTransferObject } from "./data-transfer-object";

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
