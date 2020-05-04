import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User>(null);
    private expirationTimer: any;
    
    constructor(private http: HttpClient, private router:Router) { }

    singup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB0_3ih2BFArS0gBy61qtYXCidOOaVHWmk',
            {
                email: email,
                password: password,
                returnSecureTocen: true
            }).pipe(
                catchError(this.handleError),
                tap( data => {
                    this.handleAuthentication(data.email, data.localId, data.idToken, data.expiresIn);  
                })
            );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB0_3ih2BFArS0gBy61qtYXCidOOaVHWmk',
            {
                email: email,
                password: password,
                returnSecureTocen: true
            }).pipe(
                catchError(this.handleError),
                tap( data => {
                    this.handleAuthentication(data.email, data.localId, data.idToken, data.expiresIn);  
                })
            );
    }   

    autoLogin(){
        const userData : {
            email:string,
            id:string,
            _token:string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }
        const user = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if(user.token){
            this.user.next(user);
            this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
        }
    }

    logout(){
        this.user.next(null);
        localStorage.removeItem('userData');
        this.router.navigate(['/auth'])
        if(this.expirationTimer){
            clearTimeout(this.expirationTimer);
        }
        this.expirationTimer = null;
    }

    autoLogout(expiration: number){
        this.expirationTimer = setTimeout( () => {
            this.logout()
        }, expiration);
    }

    private handleAuthentication(email:string, userId:string, token:string, expires:string){
        
        const expiresIn = new Date(new Date().getTime() + +expires*1000);

        const user = new User(email, userId, token, expiresIn);
        this.user.next(user);
        this.autoLogout(3600*1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    // private getToken(token: string){
    //     return this.http.post<{expiresIn:string, idToken:string}>('https://securetoken.googleapis.com/v1/token?key=AIzaSyB0_3ih2BFArS0gBy61qtYXCidOOaVHWmk',
    //         {
    //             grant_type: 'refresh_token',
    //             refresh_token: token
    //         }
    //     );
    // }

    private handleError(error: HttpErrorResponse) {
        let errorMess = 'An unknown error occurred';
        if (!error.error || !error.error.error) {
            return throwError(errorMess);
        }
        switch (error.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMess = 'This email exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMess = 'This email does not exist!';
                break;
            case 'INVALID_PASSWORD':
                errorMess = 'This password is incorrect!';
                break;
        }
        return throwError(errorMess);
    }
}