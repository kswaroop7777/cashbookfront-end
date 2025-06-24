import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewBook } from '../new-book/new-book';
import { User } from '../../services/user';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,MatSidenavModule,MatButtonModule,MatIconModule,MatDividerModule,RouterModule,MatTooltipModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{
 
    user=inject(User)
    books:any=[]
    router=inject(Router)
  dialog=inject(MatDialog)

  ngOnInit(): void {
    this.getBooks()
    
  }

  addBook(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus=true
    dialogConfig.disableClose=true
    dialogConfig.width='700px'
     const ref=this.dialog.open(NewBook,dialogConfig)
     ref.componentInstance.emitter.subscribe({
      next:(res:any) =>{
        this.getBooks()
      }
     })
  }

  getBooks(){
    const{username, password}=this.user.retrieveCredentials()
    this.user.getUsers().subscribe({
      next:(res:any) => {
        res.forEach(user =>{
          if(user.username == username && user.password == password){
            this.books = user.books
            console.log("Books",this.books)
          }
        })
      },
      error:(err:any) =>{
        console.log("Error",err)
      }
    })
  }
  viewBook(book){
    console.log("Selected Book",book)
    this.router.navigate(['/viewbook'],{queryParams:{book:book.bookTitle}})
  }
}
