import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from "@angular/common/http";
import {s} from "@angular/core/src/render3";

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(private http : HttpClient) { }

  getUserListings(userID){
    console.log("Hello")
    return this.http.post('/api/listings',{
      userID : userID
    })
  }

  getAllListings(){
    return this.http.get('/api/listings/')
  }

  getSingleLisitng(id : number){
    let params = new HttpParams()
    params = params.append('id',"" + id)
    return this.http.get('/api/listings',{params : params})
  }


  getFilterByPrice(minPrice: number,maxPrice: number){
    let params = new HttpParams()
    params = params.append('minPrice',String(minPrice))
    params = params.append('maxPrice',String(maxPrice))
    return this.http.get('/api/listings/price',{params : params})
  }

  filterByCondtion(stringVal : string){
    let params = new HttpParams();
    params = params.append("stringVal",stringVal)
    return this.http.get('/api/listings/condition',{params : params})
  }

  getFilterResults(minPrice: number,maxPrice: number, bestCondition: string){
    let params = new HttpParams()
    params = params.append('minPrice',String(minPrice))
    params = params.append('maxPrice',String(maxPrice))
    params = params.append('bookCondition',String(bestCondition))
    return this.http.get('/api/listings/filter',{params : params})
  }

  getItemsByBookName(bookName : string){
    let params = new HttpParams()
    params = params.append('bookName',bookName)
    return this.http.get('/api/listings/queryName',{params : params})
  }

  getItemsByAuthorName(authorName : string){
    let params = new HttpParams()
    params = params.append('authorName',authorName)
    return this.http.get('/api/listings/queryAuthor',{params : params})
  }

  addItemsToListings(newItem : Object){
    return this.http.post('/api/listings/add',newItem)
  }
}
