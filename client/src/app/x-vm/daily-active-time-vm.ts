import { DailyActiveTimeDto } from "../x-dto/daily-active-time-dto";
import { ViewModel } from "./view-model";

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
