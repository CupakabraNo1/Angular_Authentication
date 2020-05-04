import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGard implements CanActivate{

    constructor(private auth: AuthService, private router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree | boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.auth.user.pipe(
            take(1),
            map(user=>{
                const isAuth = !!user;
                if(isAuth) return true;
                 return this.router.createUrlTree(['/auth']);
            })
            // ,tap( isActive => {
            //     if(!isActive) this.router.navigate(['/auth']);
            // })
            ); 
    }

}