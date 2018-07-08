import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WishListSend} from "../Models/WishListSend";

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http : HttpClient) { }
  addWishListItems(newWishListItem : WishListSend){
    console.log("Adding",newWishListItem)
    return this.http.post('/api/wishlist/add',newWishListItem)
  }

  removeWishListItems(id){
    return this.http.post('/api/wishlist/remove',{
      id : id
    })
  }
  getAllItems(userID : number){
    return this.http.post('/api/wishlist',{
      userID : userID
    })
  }
}
