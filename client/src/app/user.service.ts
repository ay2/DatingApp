import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = 'https://localhost:5001/api/users';
  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<any>{
    return this.httpClient.get(this.url);
  }
}
