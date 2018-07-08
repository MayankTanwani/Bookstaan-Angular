import { Component, OnInit } from '@angular/core';
import {ListingService} from "../listing/listing.service";
import {UserService} from "../user.service";
import {User} from "../Models/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailText;
  passwordText;
  localUserDetails;
  currentUser : User = new User();
  constructor(private MyUserService : UserService,private route : Router) { }

  ngOnInit() {
    this.changeActiveNavbar()
    if(this.checkForCurrentUser()){
      this.route.navigate(['profile'])
    }
  }

  loginUser(){
    if(this.emailText == "" || this.emailText==undefined){
      this.showToastDanger("All Fields are necessary")
      return;
    }
    if(this.passwordText == "" || this.passwordText==undefined){
      this.showToastDanger("All Fields are necessary")
      return;
    }
      this.MyUserService.authenticateUser(this.emailText,this.passwordText)
        .toPromise().then((data : User[])=>{
          console.log(data)
          console.log("Welcome : "+  data[0].name)
          localStorage["currentUser"] = JSON.stringify({
            name : data[0].name,
            id : data[0].id
          })
        this.route.navigate(['listings'])
      })
        .catch(error => {
          console.log(error.error);
          this.showToastDanger("Invalid Email or Password")
        })
  }

  changeActiveNavbar(){
    document.getElementById("listingsNavbar").classList.remove("active")
    document.getElementById("sellNavbar").classList.remove("active")
    document.getElementById("authNavbar").classList.add("active")
    document.getElementById("messagesNavbar").classList.remove("active")
    document.getElementById("wishlistNavbar").classList.remove("active")
  }

  showToast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  showToastDanger(message : string) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar2");
    // Add the "show" class to DIV
    x.innerText = message
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
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
      this.MyUserService.getUserInfo(this.localUserDetails.id).toPromise()
        .then((data : User) => {this.currentUser = data})
        .catch((error) => console.log(error))
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

}
