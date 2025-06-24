import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { globalProperties } from '../../shared/globalProperties';
import { Encryption } from '../../services/encryption';
import { User } from '../../services/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule,MatFormFieldModule,MatButtonModule,ReactiveFormsModule,MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  loginForm:any=FormGroup
  formBuilder=inject(FormBuilder)
  private _encryption=inject(Encryption)
  private _user=inject(User)
  private _router=inject(Router)
  private _toastr=inject(ToastrService)

ngOnInit(): void {
  this.loginForm=this.formBuilder.group({
    username:['',[Validators.required, Validators.pattern(globalProperties.nameRegx)]],
    password:['',Validators.required]
  })
}

onLogin(){
  const formData=this.loginForm.value
  const username=formData.username
  const password=formData.password

  // console.log('username:',username)
  // console.log('password:',password)

  this._user.getUsers().subscribe({
    next:(res:any) =>{
      let validUser=res.find(user =>user.username==username && user.password==password)
      if(validUser){
        this._user.storeCredentials(username,password)
        this._toastr.success('Welcome to Cashbook','Success',globalProperties.toastrConfig)
        this._router.navigate(['/dashboard'])
      }
      else{
        this._toastr.error('Invaid Login','Login Fail',globalProperties.toastrConfig)
        this.loginForm.reset()
      }
    },
    error:(err:any)=>{
      console.log("Error",err)
    }
  })
}
}
