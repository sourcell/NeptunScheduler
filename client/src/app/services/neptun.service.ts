import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CourseDto } from '../x-dto/course-dto';
import { SubjectDto } from '../x-dto/subject-dto';

export interface NeptunSerivceOptions {
    username: string,
    password: string,
    neptunCodes: Array<string>
};

export interface PostNeptunServiceResult {
    subjects: Array<SubjectDto>,
    courses: Array<CourseDto>
};

@Injectable({
    providedIn: 'root'
})
export class NeptunService {

    private url = 'http://localhost:3000/'
    
    constructor(private readonly http: HttpClient) { }

    async importViaNeptun(options: NeptunSerivceOptions): Promise<PostNeptunServiceResult> {
        return await firstValueFrom(this.http.post<PostNeptunServiceResult>(this.url, options));
    }

}
