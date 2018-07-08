import { Component, OnInit } from '@angular/core';
import {User} from "../Models/User";
import {UserService} from "../user.service";

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {

  constructor(private myUserService : UserService) { }
  currentUser:  User;
  localUserDetails;
  ngOnInit(){
  this.checkForCurrentUser();
  }

  checkForCurrentUser(): boolean {
    let navbar = document.getElementById("mainNavbar") as HTMLElement
    navbar.hidden = false
    if (localStorage.getItem("currentUser") === null) {
      console.log("error not logged in")
      this.changeUserName(0)
      return false;
    } else {
      console.log("getting user")
      this.localUserDetails = JSON.parse(localStorage.getItem("currentUser"))
      this.changeUserName(1)
      this.myUserService.getUserInfo(this.localUserDetails.id).toPromise()
        .then((data: User) => {
          this.currentUser = data;
        })
        .catch((error) => {console.log(error)})
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
