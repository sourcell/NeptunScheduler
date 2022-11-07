import { ScheduleUnitDto } from "../x-dto/schedule-unit-dto";

export class ScheduleUnitVm {
    public title: string = '';
    public code: string = '';
    public slots: number = 0;
    public day: string = '';
    public start: string = '';
    public end: string = '';
    public teachers: string = '';
    public fix: boolean = false;
    public collidable: boolean = false;
    public priority: number = 0;
    public isCourse: boolean =  false;

    public toDto(): ScheduleUnitDto {
        let dto: ScheduleUnitDto = new ScheduleUnitDto();
        Object.assign(dto, this);

        dto.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(this.day);

        let tmp = this.start.split(':');
        dto.start = +tmp[0] * 60 + +tmp[1];

        tmp = this.end.split(':');
        dto.end = +tmp[0] * 60 + +tmp[1];

        return dto;
    }
}
