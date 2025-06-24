import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import { User } from '../../services/user';
import { ToastrService } from 'ngx-toastr';
import { globalProperties } from '../../shared/globalProperties';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [
          CommonModule, 
          MatDialogModule,
          MatToolbarModule,
          MatButtonModule,
          MatIconModule,
          MatDividerModule,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatDatepickerModule,
          MatCalendar
        ],
  templateUrl: './edit-transaction.html',
  styleUrl: './edit-transaction.css',
  providers: [DatePipe]
})
export class EditTransaction implements OnInit{

  transactionData : any = {}
  bookName : any
  userId: any
  datePipe = inject(DatePipe)
  userService = inject(User)
  toastr = inject(ToastrService)
  dialogRef = inject(MatDialogRef<EditTransaction>)
  emitter = new EventEmitter()
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any){
    console.log("Dialog Data: ", dialogData)
     this.transactionData = dialogData.data
    this.bookName = dialogData.bookName
    this.userId = dialogData.userId

  }
  editForm : any = FormGroup
  formBuilder = inject(FormBuilder)
  ngOnInit(): void {
    console.log("Transaction Data: ", this.transactionData)
    // Convert the date string into a Date Object
    const dateParts = this.transactionData.date.split('/') // dateParts = ['10','03','2024']
    console.log("Splitted Date parts: ", dateParts)
    const formattedDate = new Date(+dateParts[2], +dateParts[0]-1, +dateParts[1])

    this.editForm = this.formBuilder.group({
      date: [new Date(), Validators.required],
      time: ['', Validators.required],
      amount: [0, Validators.required],
      description: ['', Validators.required]
    })

    this.editForm.patchValue({
      date: formattedDate,
      time: this.transactionData.time,
      amount: this.transactionData.amount,
      description: this.transactionData.description
    })
  }

  updateTransaction(){
    const formData = this.editForm.value
    const newDate = this.datePipe.transform(formData.date, 'MM/dd/yyyy')
    const data = {
      date: newDate,
      time: formData.time,
      amount: formData.amount,
      description: formData.description
    }
    if(this.transactionData.type == 'cash-in'){
      this.userService.updateCashInEntry(this.userId, this.bookName, data).subscribe({
        next: () => {
          this.toastr.success('Transaction updated Successfully', 'Suucess', globalProperties.toastrConfig)
          this.dialogRef.close()
          this.emitter.emit()
        }
      })
    }
    if(this.transactionData.type == 'cash-out'){
      this.userService.updateCashOutEntry(this.userId, this.bookName, data).subscribe({
        next: () => {
          this.toastr.success('Transaction updated Successfully', 'Suucess', globalProperties.toastrConfig)
          this.dialogRef.close()
          this.emitter.emit()
        }
      })
    }

  }
  
}