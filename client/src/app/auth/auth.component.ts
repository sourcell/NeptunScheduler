import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/rest.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {

    public loginDto: UserDto;
    public registerDto: UserDto;
    public passconf: string = '';

    public loginLoad = false;
    public registerLoad = false;

    public registerResult: UserResult = new UserResult();

    public loginErrorMsg: string = '';
    public registerErrorMsg: string = '';

    private readonly rest: RestService;
    private readonly router: Router;

    constructor(rest: RestService, router: Router) {
        this.rest = rest;
        this.router = router;

        this.logout();

        this.loginDto = new UserDto();
        this.registerDto = new UserDto();
    }

    public async register(): Promise<void> {
        if (this.registerDto.password != this.passconf) {
            this.registerErrorMsg = 'Password confirmation failed.';
            this.registerDto.password = '';
            this.passconf = '';
            return;
        }

        this.registerLoad = true;

        await this.rest.post<UserResult>('/auth/register', this.registerDto)
            .then(res => {
                this.registerResult = res;
                this.registerErrorMsg = '';
                this.reset();
            })
            .catch(err => {
                this.registerErrorMsg = err.error;
            });

        this.registerLoad = false;
    }

    public async login(): Promise<void> {
        this.loginLoad = true;

        await this.rest.post<UserResult>('/auth/login', this.loginDto)
            .then(res => {
                sessionStorage.setItem('username', res.username);
                sessionStorage.setItem('token', res.token);
                this.router.navigate(['subjects']);
            })
            .catch(err => {
                this.loginErrorMsg = err.error;
            });

        this.loginLoad = false;
    }

    public logout(): void {
        sessionStorage.clear();
    }

    private reset(): void {
        this.loginDto.username = '';
        this.loginDto.password = '';
        this.registerDto.username = '';
        this.registerDto.password = '';
        this.passconf = '';
        this.loginLoad = false;
        this.registerLoad = false;
    }

}

class UserDto {
    username: string = '';
    password: string = '';
}

class UserResult {
    id: string = '';
    username: string = '';
    roles: string = '';
    token: string = '';
}
