import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../services/user';
import { globalProperties } from '../../shared/globalProperties';
import { Dashboard } from '../../services/dashboard';

@Component({
  selector: 'app-new-book',
  imports: [CommonModule,MatToolbarModule,MatIconModule,MatButtonModule,MatDialogModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './new-book.html',
  styleUrl: './new-book.css'
})
export class NewBook implements OnInit {

  bookForm: any = FormGroup
  fb = inject(FormBuilder)
  toastr = inject(ToastrService)
  dashboard = inject(Dashboard)
  user = inject(User)
  dialogRef = inject(MatDialogRef<NewBook>)
  userId : any
  emitter = new EventEmitter()

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

async  addNewBook(){
    const formData = this.bookForm.value
    const bookName = formData.name
    let userDetails = this.user.retrieveCredentials()
    console.log("User Details: ", userDetails)
    await this.user.getUsers().subscribe({
      next: (res: any) => {
        res.find(obj => {
          if(obj.username == userDetails.username && obj.password == userDetails.password){
            this.userId = obj.id
          }
        })
        console.log("User Id: ", this.userId)
        this.dashboard.addNewBook(this.userId, bookName).subscribe({
          next: (res: any) => {
            this.toastr.success(`"${bookName}" Book added successfully `, 'Success', globalProperties.toastrConfig)
            this.dialogRef.close()
            this.emitter.emit()
          },
          error: (err: any) => {
            this.toastr.error("No Book was Added", 'Fail', globalProperties.toastrConfig)
          }
        })
      }
    })
  }
}