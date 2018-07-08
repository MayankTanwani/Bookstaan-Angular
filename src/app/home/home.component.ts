import { Component, OnInit } from '@angular/core';
import {User} from "../Models/User";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  localUserDetails;
  fragment : string;
  constructor(private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {this.fragment = fragment;this.ngAfterViewInit()})
    let navbar = document.getElementById("mainNavbar") as HTMLElement
    navbar.hidden = true
    this.checkForCurrentUser()
  }

  ngAfterViewInit() : void{
    try{
      document.querySelector('#' + this.fragment).scrollIntoView();
    }catch (e) {
    }
  }

  checkForCurrentUser(): boolean {
    if (localStorage.getItem("currentUser") === null) {
      console.log("error not logged in")
      this.changeUserName(0)
      return false;
    } else {
      console.log("getting user")
      this.localUserDetails = JSON.parse(localStorage.getItem("currentUser"))
      this.changeUserName(1)
      return true
    }
  }

  changeUserName(type: number) {
    let userButton = document.getElementById("navbarUser");
    let loginButton = document.getElementById("navbarLogin");
    if(type == 1){
      userButton.innerText = this.localUserDetails.name;
      userButton.hidden = false;
      loginButton.hidden = true;
    }else{
      userButton.hidden = true;
      loginButton.hidden = false;
    }
  }


}
