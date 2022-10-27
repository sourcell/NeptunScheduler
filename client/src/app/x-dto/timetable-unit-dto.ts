import { TimetableUnitVm } from "../x-vm/timetable-unit-vm";

export class TimetableUnitDto {
    public title: string = '';
    public code: string = '';
    public slots: number = 0;
    public day: number = 0;
    public start: number = 0;
    public end: number = 0;
    public teachers: string = '';
    public fix: boolean = false;
    public collidable: boolean = false;
    public priority: number = 0;
    public isCourse: boolean =  false;

    public toVm(): TimetableUnitVm {
        let vm: TimetableUnitVm = new TimetableUnitVm();
        Object.assign(vm, this);

        vm.day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.day];

        let startHours = Math.floor(this.start / 60);
        let startMinutes = this.start - startHours * 60;
        vm.start = (startHours < 10 ? '0'+startHours : startHours) + ':';
        vm.start += startMinutes < 10 ? '0'+startMinutes : startMinutes;

        let endHours = Math.floor(this.end / 60);
        let endMinutes = this.end - endHours * 60;
        vm.end = (endHours < 10 ? '0'+endHours : endHours) + ':';
        vm.end += endMinutes < 10 ? '0'+endMinutes : endMinutes;

        return vm;
    }
}
