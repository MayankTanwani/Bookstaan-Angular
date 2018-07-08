import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  authenticateUser(email: string,password: string){
    return this.http.post('/api/user/login',{
      email : email,
      password : password
    })
  }
  signUpUser(newUser : Object){
    return this.http.post('/api/user/signup',newUser)
  }
  getUserInfo(userID : number){
    return this.http.post('/api/user',{
      id : userID
    })
  }
}
