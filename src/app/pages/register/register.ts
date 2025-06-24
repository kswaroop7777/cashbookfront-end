import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { globalProperties } from '../../shared/globalProperties';
import { User } from '../../services/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm:any=FormGroup
  formBuilder=inject(FormBuilder)
  public _userService = inject(User)
  private _toastrService = inject(ToastrService)
  private _router = inject(Router)

ngOnInit(): void {
  this.registerForm=this.formBuilder.group({
    username:['',[Validators.required, Validators.pattern(globalProperties.nameRegx)]],
    email:['',[Validators.required, Validators.email]],
    password:['',[Validators.required]]
  })
}

onRegister(){
  const formData=this.registerForm.value
 // console.log('Form Data:',formData)
  this._userService.userRegister(formData).subscribe({
    next:(res:any) =>{
      this._toastrService.success('Registration Successful','Success',globalProperties.toastrConfig)
      this._router.navigate(['/login'])
    },
    error:(err:any) =>{
      this._toastrService.error('Registration Fail','Fail',globalProperties.toastrConfig)
      this.registerForm.reset()
    }
  })
  
}

}
