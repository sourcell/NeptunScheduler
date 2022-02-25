import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestService {

    private url: string = '';
    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    // 'item' parameter is only for the prototype
    public async get<T>(endpoint: string, item: T): Promise<T> {
        await new Promise(r => setTimeout(r, 1000));
        return item;

        // const result = await firstValueFrom(this.http.get<T>(this.url + endpoint, {
        //     headers: { 'username': 'username', 'token': 'token' }
        // }));

        // return result;
    }

    public async post<T>(endpoint: string, item: T): Promise<T> {
        await new Promise(r => setTimeout(r, 1000));
        return item;

        // const result = await firstValueFrom(this.http.post<T>(this.url + endpoint, item, {
        //     headers: { 'username': 'username', 'token': 'token' }
        // }));

        // return result;
    }

    public async _post<T>(endpoint: string, item: any, token: string = ''): Promise<T> {
        const result = await firstValueFrom(this.http.post<T>(this.url + endpoint, item, {
            headers: { 'Authorization': 'Bearer ' + token }
        }));

        return result;
    }

    public async put<T>(endpoint: string, item: T): Promise<T> {
        await new Promise(r => setTimeout(r, 1000));
        return item;

        // const result = await firstValueFrom(this.http.put<T>(this.url + endpoint, item, {
        //     headers: { 'username': 'username', 'token': 'token' }
        // }));

        // return result;
    }

    // 'item' parameter is only for the prototype
    public async delete<T>(endpoint: string, id: T): Promise<T> {
        await new Promise(r => setTimeout(r, 1000));
        return id;

        // const result = await firstValueFrom(this.http.delete<T>(this.url + endpoint, {
        //     headers: { 'username': 'username', 'token': 'token' }
        // }));

        // return result;
    }
}
