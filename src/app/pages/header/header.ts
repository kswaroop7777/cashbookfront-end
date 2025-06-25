import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, inject, OnInit, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../services/user';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  preserveWhitespaces: true
})


export class Header implements OnInit, AfterViewChecked{
  isMenuOpen = false;

  private _user = inject(User)
  private _router = inject(Router)

  public username = signal('')

  ngOnInit(): void {
    this.getUser()
  }

  ngAfterViewChecked(): void {
    this.getUser()
  }

  getUser(){
    const user = sessionStorage.getItem('userCredentials')
    if(user){
      const userDetails = this._user.retrieveCredentials().username
      this.username.update(username => username = userDetails )
    }
  }  
  logOut(){
    sessionStorage.removeItem('userCredentials')
    this.username.update(u => u='')
    this._router.navigate(['/'])
  }
}