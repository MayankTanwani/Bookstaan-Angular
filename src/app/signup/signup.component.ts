import { Component, OnInit } from '@angular/core';
import {User} from "../Models/User";
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import { finalize } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireStorage} from 'angularfire2/storage';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  newUser : User = new User();
  uploadFile : File = null;

  uploadPercent: Observable<number>;

  localUserDetails;
  currentUser : User = new User();
  downloadURL: Observable<string>;
  constructor(private myUserService : UserService,private route : Router,private storage: AngularFireStorage) { }

  ngOnInit() {
    this.changeActiveNavbar()
    this.checkForCurrentUser();
    this.newUser.picture = "http://getdrawings.com/img/cool-facebook-profile-picture-silhouette-10.jpg"
  }

  signUpUser(){
    console.log(this.newUser)
    if(this.newUser.picture == "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif")
    {
      this.showToastDanger("Please let image upload first");
      return;
    }
    for(let property in this.newUser) {
      console.log(property, this.newUser[property])
      if (this.newUser[property] == undefined || this.newUser[property] == "" || this.newUser[property] == null) {
        this.showToastDanger("All field are necessary");
        return;
      }
    }

    if(!this.newUser.phone.match(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/)){
        this.showToastDanger("Please enter a valid Indian phone number");
        return;
      }
      if(!this.newUser.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)){
        this.showToastDanger("Email id not valid")
        return;
      }

      if(this.newUser.password.length<6)
      {
        this.showToastDanger("Password should not be less than 6");
        return;
      }
    this.myUserService.signUpUser(this.newUser).toPromise().then((data:User) => {
      localStorage.setItem("currentUser",JSON.stringify({
        id : data.id,
        name : data.name
      }))
      this.showToastSuccess()
      this.route.navigate(['listings']);
    }).catch((error) => {
      console.log(error);
      this.showToastDanger("Email already exists\n Please Login using it.");
    })
  }
  selectFile(event){
    if(event.target.files[0] != undefined || event.target.files[0] != null){
      this.uploadFile = event.target.files[0]
    }
  }
  uploadToServer(){
    if(this.uploadFile == null  || this.uploadFile == undefined ){
      this.showToastDanger("Please select a file first");
      return;
    }
    this.newUser.picture = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
    console.log(this.uploadFile)
    const filePath = 'profileImage/dp-' + new Date().getTime()
    const fileRef  = this.storage.ref(filePath)
    const task = this.storage.upload(filePath,this.uploadFile);
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(
      finalize(() => {this.downloadURL = fileRef.getDownloadURL();this.downloadURL.subscribe((data) => {
        console.log(data);this.newUser.picture = data
      })} )
    )
      .subscribe((data) => console.log(data))
  }
  uploadEvent(event) {
    let button = document.getElementById("fileUploadBut") as HTMLElement
    console.log(button)
    button.click()
  }

  fileUploader(event) {
    if(event.target.files[0] != undefined || event.target.files[0] != null) {
      let file = event.target.files[0]
      this.uploadFile = file
      this.uploadToServer()
    }else return;
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

  showToastSuccess() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){
      x.className = x.className.replace("show", "");
    }, 3000);
  }
  showToastDanger(message : string) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar2");
    x.innerText = message
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function()
    { x.className = x.className.replace("show", "");
    }, 3000);
  }

}
