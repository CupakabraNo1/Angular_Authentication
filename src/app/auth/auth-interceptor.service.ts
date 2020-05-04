import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private auth: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.auth.user.pipe(
            take(1),
            exhaustMap( user => {
                if(!user) {return next.handle(req)}
                console.log(user.token);
                const modified = req.clone(
                    {
                    params:new HttpParams().set('auth', user.token)
                    }
                );
                return next.handle(modified);
            })
        );
    }



}