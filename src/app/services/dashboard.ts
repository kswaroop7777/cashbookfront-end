import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dashboard {

  url = environment.apiURL
  http = inject(HttpClient)
 
  addNewBook(userId: string, bookName: string){
    // return  this.http.patch(`${this.url}/users/${userId}`, {books: {title: bookName}})  
    return this.http.get(`${this.url}/user/${userId}`).pipe(
      switchMap((user: any) => {
        const updatedBooks = user.books ? [...user.books, {bookTitle: bookName}] : [{bookTitle: bookName}]
        return this.http.patch(`${this.url}/user/${userId}`, {books: updatedBooks})
      })
    )

  }
/*
  1. When the GET request completes and emits the user data, 'switchMap() recevies this data and uses it to create a new Obsevable with PATCH
  2. the PATCH request updates the user's books list with the new book
  3. If new call to PATCH, switchMAp will cancel the previous PATCH Req. ensuring that only the latest update is procesed.
*/

}