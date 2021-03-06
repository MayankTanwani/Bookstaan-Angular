import { Component, OnInit } from '@angular/core';
import {MessageService} from "./message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Message} from "../Models/Message";
import {User} from "../Models/User";
import {UserService} from "../user.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(private myMessageService : MessageService,private myUserService : UserService,
              private router : ActivatedRoute,private route : Router) { }

  user;
  allMessages : Message[];
  localUserDetails;
  currentUser : User;
  ngOnInit() {
    this.changeActiveNavbar()
   if(this.checkForCurrentUser()){
      this.myMessageService.getMessages(this.localUserDetails.id).toPromise().then((data : Message[])=>{
        this.allMessages = data
        this.allMessages.map((items) => {
          let abc = new Date(items.createdAt)
          abc.toDateString()
          items.createdAt = abc.toDateString()
        });
      }).catch(error=>console.log(error))
    }
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
        .then((data : User) => {this.currentUser = data;})
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
    document.getElementById("messagesNavbar").classList.add("active")
    document.getElementById("wishlistNavbar").classList.remove("active")
  }

}
