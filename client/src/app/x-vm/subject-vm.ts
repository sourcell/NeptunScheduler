import { CourseDto } from "../x-dto/course-dto";
import { SubjectDto } from "../x-dto/subject-dto";
import { CourseVm } from "./course-vm";
import { ViewModel } from "./view-model";

export class SubjectVm implements ViewModel {
    public id: string = '';
    public title: string = '';
    public credits: number = 0;
    public courses: Array<CourseVm> = new Array<CourseVm>();

    public copy(): SubjectVm {
        return Object.assign(new SubjectVm(), this);
    }

    public toDto(): SubjectDto {
        let dto = Object.assign(new SubjectDto(), this);
        dto.courses = this.courses.map(c => Object.assign(new CourseDto(), c));;
        return dto;
    }
}
