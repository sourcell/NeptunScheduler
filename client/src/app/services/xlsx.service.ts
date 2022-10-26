import { Injectable } from '@angular/core';
import { CourseVm } from '../x-vm/course-vm';
import * as XLSX from 'xlsx';
import { CourseDto } from '../x-dto/course-dto';

@Injectable({
    providedIn: 'root'
})
export class XlsxService {

    constructor() { }

    public getFileNames(files: FileList | null): Array<string> {
        if (!files) {
            return [];
        }
        const fileNames: Array<string> = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file && file.name.match('.+\.xlsx$')) {
                fileNames.push(file.name.substring(0, file.name.indexOf('.xlsx')));
            }
        }
        return fileNames;
    }

    public async importCourses(file: File): Promise<CourseDto[]> {
        const result: Array<CourseDto> = [];
        if (file.name.match('.xlsx$')) {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: Array<any> = XLSX.utils.sheet_to_json(worksheet);
            rows.forEach(row => {
                const tempModel = new CourseVm();
                tempModel.code = row['Kurzus kódja'];
                const slotsData = row['Fő/Várólista/Limit'].split('/');
                tempModel.slots = +slotsData[2] - +slotsData[0];
                tempModel.teachers = row['Oktatók'];
                tempModel.fix = row['Kurzus típusa'] === 'Elmélet';
                const dayCodes = ['V', 'H', 'K', 'SZE', 'CS', 'P', 'SZO'];
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const fullTimeData = row['Órarend infó'];
                const timeData: string = fullTimeData.slice(0, fullTimeData.indexOf(' '));
                if (timeData !== '') {
                    const endOfDay = timeData.indexOf(':');
                    const dayCode = timeData.slice(0, endOfDay);
                    tempModel.day = dayNames[dayCodes.indexOf(dayCode)];
                    tempModel.start = timeData.slice(endOfDay + 1, endOfDay + 6);
                    tempModel.end = timeData.slice(endOfDay + 7, endOfDay + 12);
                    result.push(tempModel.toDto());
                }
            });
        }
        return result;
    }

    public async importCoursesByFileName(files: FileList | null, fileName: string): Promise<CourseDto[]> {
        if (!files) {
            return [];
        }
        const result: Array<CourseDto> = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name === fileName + '.xlsx') {
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows: Array<any> = XLSX.utils.sheet_to_json(worksheet);
                rows.forEach(row => {
                    const tempModel = new CourseVm();
                    tempModel.code = row['Kurzus kódja'];
                    const slotsData = row['Fő/Várólista/Limit'].split('/');
                    tempModel.slots = +slotsData[2] - +slotsData[0];
                    tempModel.teachers = row['Oktatók'];
                    tempModel.fix = row['Kurzus típusa'] === 'Elmélet';
                    const dayCodes = ['V', 'H', 'K', 'SZE', 'CS', 'P', 'SZO'];
                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const fullTimeData = row['Órarend infó'];
                    const timeData: string = fullTimeData.slice(0, fullTimeData.indexOf(' '));
                    if (timeData !== '') {
                        const endOfDay = timeData.indexOf(':');
                        const dayCode = timeData.slice(0, endOfDay);
                        tempModel.day = dayNames[dayCodes.indexOf(dayCode)];
                        tempModel.start = timeData.slice(endOfDay + 1, endOfDay + 6);
                        tempModel.end = timeData.slice(endOfDay + 7, endOfDay + 12);
                        result.push(tempModel.toDto());
                    }
                });
            }
        }
        return result;
    }

}
