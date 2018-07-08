import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../Models/User";
import {UserService} from "../user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private route : Router,private myUserService : UserService) { }

  localUserDetails;
  currentUser : User;

  ngOnInit() {
    this.changeActiveNavbar()
    if(!this.checkForCurrentUser()){
      this.route.navigate(['login'])
    }
  }

  checkForCurrentUser() : boolean{
    let navbar = document.getElementById("mainNavbar") as HTMLElement
    navbar.hidden = false
    if(localStorage.getItem("currentUser") === null){
      console.log("error not logged in")
      this.changeUserName(0)
      return false;
    }else{
      console.log("getting user")
      this.localUserDetails = JSON.parse(localStorage.getItem("currentUser"))
      this.changeUserName(1)
      this.myUserService.getUserInfo(this.localUserDetails.id).toPromise()
        .then((data : User) => {this.currentUser = data})
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
    document.getElementById("authNavbar").classList.add("active")
    document.getElementById("messagesNavbar").classList.remove("active")
    document.getElementById("wishlistNavbar").classList.remove("active")
  }

  redirectToWishList() {
    this.route.navigate(['wishlist'])
  }

  redirectToSell() {
    this.route.navigate(['listings','add'])
  }

  redirectToMessages() {
    this.route.navigate(['messages'])
  }

  logoutUser() {
    this.route.navigate(['logout'])
  }

  redirectToProfileListings() {
    this.route.navigate(['profile','listings'])
  }
}
