import { CourseVm } from "../x-vm/course-vm";
import { SubjectVm } from "../x-vm/subject-vm";
import { CourseDto } from "./course-dto";
import { DataTransferObject } from "./data-transfer-object";

export class SubjectDto implements DataTransferObject {
    public id: string = '';
    public title: string = '';
    public credits: number = 0;
    public courses: Array<CourseDto> = new Array<CourseDto>();

    public toVm(): SubjectVm {
        let vm = Object.assign(new SubjectVm(), this);
        vm.courses = this.courses.map(c => Object.assign(new CourseVm(), c));;
        return vm;
    }
}
