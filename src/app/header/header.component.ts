import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  isAuthenticated = false;
   
  constructor(private dataStorageService: DataStorageService, private auth: AuthService) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe( user => {
      console.log(user);
      this.isAuthenticated = user? true:false;
    });
  }

  logout(){
    this.auth.logout();
  }
  

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
