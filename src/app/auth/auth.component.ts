import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AuthResponseData } from "./auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error : string = null;

    constructor(private auth: AuthService, private router:Router){}

    onSwitchMode(){
      this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm){
      if(!form.valid){
        return;
      }

      let authObs: Observable<AuthResponseData>;
      this.isLoading = true;

      if(this.isLoginMode){
        authObs = this.auth.login(form.value.email, form.value.password);
      }else{
        authObs = this.auth.singup(form.value.email, form.value.password);
      }

      authObs.subscribe(data => {
        console.log(data);
        this.error = null;
        this.isLoading = false;
        this.router.navigate(['/recipes']); 
      }, error => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
      });

      form.reset();
    }

}
