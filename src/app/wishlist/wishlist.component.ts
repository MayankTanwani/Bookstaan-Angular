import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WishList} from "../Models/WishList";
import {WishlistService} from "./wishlist.service";
import {Listing} from "../Models/Listing";
import {User} from "../Models/User";
import {UserService} from "../user.service";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  localUserDetails;
  currentUser : User;
  constructor(private myUserService: UserService,private myWishlistService : WishlistService,private router : ActivatedRoute,private route : Router) { }
  user;
  allItems : WishList[];
  ngOnInit() {
    this.changeActiveNavbar()
    this.user = localStorage.getItem("currentUser")
    if(this.checkForCurrentUser()){
      this.user = JSON.parse(this.user)
      let id = this.user.id;
      console.log(this.user)
      this.myWishlistService.getAllItems(id).toPromise().then((data : WishList[])=>{
        this.allItems = data
      })
        .catch(error => console.log(error))
    }
  }
  checkCondiiton(item : Listing) : number{
    if(item.bookCondition == "New"){
      return 0
    }else if(item.bookCondition == "Almost New"){
      return 1
    }else if(item.bookCondition == "Slight Damage"){
      return 2;
    }else return 3;
  }
  redirectList(id){
    this.route.navigate(['listings',id])
  }
  checkForCurrentUser() : boolean{
    let navbar = document.getElementById("mainNavbar") as HTMLElement
    navbar.hidden = false
    if(localStorage.getItem("currentUser") === null){
      console.log("error not logged in")
      this.route.navigate(['login'])
      this.changeUserName(0)
      return false;
    }else{
      console.log("getting user")
      this.localUserDetails = JSON.parse(localStorage.getItem("currentUser"))
      this.changeUserName(1)
      this.myUserService.getUserInfo(this.localUserDetails.id).toPromise()
        .then((data : User) => {this.currentUser = data;console.log(data)})
        .catch((error) => {console.log(error);this.route.navigate(['logout'])})
      return true
    }
  }
  changeUserName(type : number){
    var username = document.getElementById("userNameNavbar")
    var btLogin = document.getElementById("loginNavbar")
    var btProfile = document.getElementById("profileNavbar")
    var btLogout = document.getElementById("logoutNavbar")
    var btSignupNavbar = document.getElementById("signupNavbar")
    if(type == 1){
      username.innerText = this.localUserDetails.name
      btLogin.hidden = true;
      btProfile.hidden = false;
      btLogout.hidden = false;
      btSignupNavbar.hidden = true;
    }else{
      username.innerText = "Sign In"
      btLogin.hidden = false;
      btProfile.hidden = true;
      btLogout.hidden = true;
      btSignupNavbar.hidden = false;
    }
  }
  changeActiveNavbar(){
    document.getElementById("listingsNavbar").classList.remove("active")
    document.getElementById("sellNavbar").classList.remove("active")
    document.getElementById("authNavbar").classList.remove("active")
    document.getElementById("messagesNavbar").classList.remove("active")
    document.getElementById("wishlistNavbar").classList.add("active")
  }

  removeFromWishlist(id: number,idx : number) {
    this.myWishlistService.removeWishListItems(id).toPromise()
      .then(() => {
        console.log("Deleted");
        this.ngOnInit();
      })
      .catch((error) => {console.log(error);this.ngOnInit();})
    this.ngOnInit()
  }
}

