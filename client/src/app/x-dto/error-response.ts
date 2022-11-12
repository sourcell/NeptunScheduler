import { ScheduleUnitDto } from "./schedule-unit-dto";

export interface ErrorResponse {
    id: string;
    message: string;
    conflicts: Array<ScheduleUnitDto>;
}
