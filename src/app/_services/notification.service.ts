import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  public NOTIFICATION_API = '.....';


  constructor(private http:HttpClient) { }

  saveToken = (token: any) => {
    return this.http.post(`${this.NOTIFICATION_API}/save`, token)
  };
}
