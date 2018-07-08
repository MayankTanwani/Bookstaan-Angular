import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageSend} from "../Models/MessageSend";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }
  getMessages(userID : number){
    return this.http.post('/api/messages',{
      recipientID : userID
    })
  }
  addNewMessage(newMessage : MessageSend){
    return this.http.post('/api/messages/add',newMessage)
  }

}
