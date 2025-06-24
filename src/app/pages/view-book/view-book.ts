import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendar} from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { User } from '../../services/user';
import { globalProperties } from '../../shared/globalProperties';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditTransaction } from '../edit-transaction/edit-transaction';

@Component({
  selector: 'app-view-book',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatNativeDateModule,MatCalendar, MatTooltipModule, MatFormFieldModule, MatInputModule, FormsModule, MatDividerModule, MatToolbarModule, ReactiveFormsModule, MatDatepickerModule, NgxMaterialTimepickerModule, MatTableModule, MatPaginatorModule],
  templateUrl: './view-book.html',
  styleUrl: './view-book.css',
  preserveWhitespaces:true,
  providers:[DatePipe]
  
})
export class ViewBook  implements OnInit , AfterViewInit{
  activateRoute=inject(ActivatedRoute)
  bookName:any=''
  router=inject(Router)
  searchkey:any=''
  isDrawerOpen=false
  addForm:any=FormGroup
  fb=inject(FormBuilder)
  userId:any=''
  toastr= inject(ToastrService)
  title:any
  entrycode=0
  cashInMoney:number
  cashOutMoney:number
  datePipe=inject(DatePipe)
  userservice=inject(User)
  entries: any;
  displayedColums:string []=['date','time','description','amount','actions']
  dialog=inject(MatDialog)
  

  @ViewChild(MatPaginator) paginator :MatPaginator
  constructor(){
    this.activateRoute.queryParams.subscribe(p => this.bookName=p['book'])
  }

  ngOnInit(): void {
    const currentTime = new Date().toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit', hour12: true})
    this.addForm=this.fb.group({
      date:[new Date(), Validators.required],
      time:[currentTime,Validators.required],
      amount:[0, Validators.required],
      description:['', Validators.required]
    })
      this.getTotals()
  }




  goBack(){
    this.router.navigate(['/dashboard'])
  }

  toggleDrawerForCashIn(){
    this.isDrawerOpen= !this.isDrawerOpen
    this.title='Add Entry for Cash In'
    this.entrycode=1
  }

  toggleDrawerForCashOut(){
    this.isDrawerOpen= !this.isDrawerOpen
    this.title='Add Entry for Cash Out'
    this.entrycode=2

  }

  toggleDrawer(){
    this.isDrawerOpen = !this.isDrawerOpen
    this.resetForm()
  }

  async save(){
    const formData=this.addForm.value
    const transactionDate = this.datePipe.transform(formData.date, 'MM/dd/yyyy') 
    // console.log("transation date",transactionDate)
    const data = {
    date: transactionDate,
    time: formData.time,
    amount: formData.amount,
    description: formData.description
  }
    let userdetails = this.userservice.retrieveCredentials()

    await this.userservice.getUsers().subscribe({
      next:(res:any)=>{
        res.find(obj =>{
          if(obj.username == userdetails.username && obj.password== userdetails.password){
            this.userId=obj.id
          }
        })
        if(this.entrycode == 1){
        this.userservice.cashInEntry(this.userId, this.bookName, data).subscribe({
          next: (res: any) => {
            this.toastr.success('Entry added successfully.','Success', globalProperties.toastrConfig)
            this.getTotals()
            this.resetForm()
            this.toggleDrawer()
            this.getEntriesTable()
           
          }
        })
      }
        if(this.entrycode == 2){
          this.userservice.cashOutEntry(this.userId, this.bookName, data).subscribe({
            next:(res:any)=>{
              this.toastr.success("Entry added successfully",'Success',globalProperties.toastrConfig)
              this.getTotals()
              this.resetForm()
              this.toggleDrawer()
              this.getEntriesTable()
            }
          })
        }
      },
      error:()=>{
        this.toastr.error("No Entry was Added",'Fail',globalProperties.toastrConfig)
      }
    })
  }

  resetForm(){
  const initailTime = new Date().toLocaleTimeString('en-us', {hour: '2-digit', minute:'2-digit', hour12:true})
  this.addForm.setValue({
    date: new Date(),
    time: initailTime,
    amount: 0,
    description: ''
  })
}

  getTotals(){
  let userDetails = this.userservice.retrieveCredentials()
  this.userservice.getUsers().subscribe({
    next: (res: any) => {
      res.find(obj => {
        if(obj.username == userDetails.username && obj.password == userDetails.password){
          obj.books.forEach( (obj:any) => {
            if(obj.bookTitle == this.bookName){
              this.cashInMoney = obj.cashInTotal
              this.cashOutMoney = obj.cashOutTotal
            }
          })
        }
      })
    }
  })
}

getEntriesTable(){
  let userDetails=this.userservice.retrieveCredentials()
  this.userservice.getUsers().subscribe({
    next:(res:any)=>{
      res.find(Obj =>{
        if(Obj.username == userDetails.username && Obj.password == userDetails.password){
          this.userId= Obj.id
        }
      })
      this.userservice.entriesTable(this.userId, this.bookName).subscribe({
        next:(entries:any[])=>{
          this.entries= new MatTableDataSource(entries)
          this.entries.paginator = this.paginator
        }
      })
    }
  })
}

get hasEntries(): boolean {
return this.entries?.data.length >0
}

ngAfterViewInit(): void {
  this.getEntriesTable()
}

applyFilter(value:any){
  this.entries.filter=value.trim().toLowerCase()

}
onSearchClear(){
  this.searchkey=''
  this.applyFilter('')
}
  

onEdit(data: any){
  console.log("Selected Transation",data)

  const dialogConfig = new MatDialogConfig
  dialogConfig.width= '500px'
  dialogConfig.autoFocus=true
  dialogConfig.disableClose=true
  dialogConfig.data ={
    data:data,
    userId: this.userId,
    bookName:this.bookName
  }
  const dialogRef=this.dialog.open(EditTransaction,dialogConfig)
  dialogRef.componentInstance.emitter.subscribe({
    next:()=>{
      this.getEntriesTable()
      this.getTotals()
    }
  })
}
  
      onDelete(data: any){
      this.userservice.deleteEntry(this.userId, this.bookName, data.type, data.date, data.time).subscribe({
      next: () => {
      this.toastr.success('Transaction Deleted Successfully', 'Success', globalProperties.toastrConfig)
      this.getEntriesTable()
      this.getTotals()
  }
})
}


}

