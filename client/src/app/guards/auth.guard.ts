import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    
    constructor(private readonly router: Router) {}
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): boolean | UrlTree {
            if (sessionStorage.getItem('username') == null || sessionStorage.getItem('token') == null) {
                return this.router.createUrlTree(['auth']);
            }
            return true;
    }

}
