import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestService {

    private url: string = 'http://localhost:5000';
    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public async get<T>(endpoint: string): Promise<T> {
        return await firstValueFrom(this.http.get<T>(this.url + endpoint));
    }

    public async post<T>(endpoint: string, item: any): Promise<T> {
        return await firstValueFrom(this.http.post<T>(this.url + endpoint, item));
    }

    public async put<T>(endpoint: string, item: any): Promise<T> {
        return await firstValueFrom(this.http.put<T>(this.url + endpoint, item));
    }

    public async delete<T>(endpoint: string): Promise<T> {
        return await firstValueFrom(this.http.delete<T>(this.url + endpoint));
    }

    public async deleteModel<T>(endpoint: string, model: T): Promise<T> {
        return await firstValueFrom(this.http.patch<T>(this.url + endpoint, model));
    }

}
