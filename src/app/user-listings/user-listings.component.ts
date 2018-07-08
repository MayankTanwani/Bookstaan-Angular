import { Component, OnInit } from '@angular/core';
import {Listing} from "../Models/Listing";
import {User} from "../Models/User";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";
import {WishlistService} from "../wishlist/wishlist.service";
import {ListingService} from "../listing/listing.service";
import {error} from "util";

@Component({
  selector: 'app-user-listings',
  templateUrl: './user-listings.component.html',
  styleUrls: ['./user-listings.component.scss']
})
export class UserListingsComponent implements OnInit {

  constructor(private myUserService: UserService,
              private myListingService : ListingService,
              private router : ActivatedRoute,private route : Router) { }

  localUserDetails;
  currentUser : User;
  allItems : Listing[];
  ngOnInit() {
    this.changeActiveNavbar()
    this.checkForCurrentUser();
    this.myListingService.getUserListings(this.localUserDetails.id).toPromise()
      .then((items:Listing[]) => this.allItems = items)
      .catch((error) => console.log(error))
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

  changeActiveNavbar(){
    document.getElementById("listingsNavbar").classList.remove("active")
    document.getElementById("sellNavbar").classList.remove("active")
    document.getElementById("authNavbar").classList.add("active")
    document.getElementById("messagesNavbar").classList.remove("active")
    document.getElementById("wishlistNavbar").classList.remove("active")
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
}
