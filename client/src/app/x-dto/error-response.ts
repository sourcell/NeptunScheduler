import { TimetableUnitDto } from "./timetable-unit-dto";

export interface ErrorResponse {
    id: string;
    message: string;
    conflicts: Array<TimetableUnitDto>;
}
