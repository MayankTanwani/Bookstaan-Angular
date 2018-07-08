import { Component, OnInit } from '@angular/core';
import {User} from "../Models/User";
import {load} from "@angular/core/src/render3/instructions";
import {Router} from "@angular/router";
import {Listing} from "../Models/Listing";
import {ListingService} from "../listing/listing.service";
import { finalize } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireStorage} from 'angularfire2/storage';
import {L} from "@angular/core/src/render3";
import {UserService} from "../user.service";


@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss']
})
export class AddListingComponent implements OnInit {

  currentUser : User = new User();
  newListing : Listing = new Listing();

  uploadFile : File = null;

  uploadPercent: Observable<number>;

  downloadURL: Observable<string>;
  localUserDetails;

  constructor(private route : Router,private myLisitngService : ListingService,
              private myUserService : UserService,
              private storage:AngularFireStorage) { }

  ngOnInit() {
    this.newListing.bookCondition = "New"
    this.changeActiveNavbar()
    this.newListing.image = "https://gangarams.com/image/cache/placeholder-250x250.png"
    if(!this.checkForCurrentUser()){
      this.route.navigate(['login'])
    }
  }

  selectFile(event){
    if(event.target.files[0] != undefined || event.target.files[0] != null){
      this.uploadFile = event.target.files[0];
      this.uploadToServer()
    }
  }
  uploadToServer(){
    if(this.uploadFile == null  || this.uploadFile == undefined ){
      alert("Please select a file first");
      return;
    }
    this.newListing.image = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
    console.log(this.uploadFile)
    const filePath = 'bookImage/image-' + new Date().getTime()
    const fileRef  = this.storage.ref(filePath)
    const task = this.storage.upload(filePath,this.uploadFile);
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(
      finalize(() => {this.downloadURL = fileRef.getDownloadURL();console.log(this.downloadURL);this.downloadURL.subscribe((data) => {
        console.log(data);this.newListing.image = data
      })} )
    )
      .subscribe((data) => console.log(data))
  }
  addNewListing(){
    if(this.newListing.image == "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif")
    {
      alert("Please let image upload first");
      return;
    }
    this.newListing.seller = this.currentUser.id
    console.log(this.newListing)
    for(let property in this.newListing){
      console.log(property,this.newListing[property])
      if(this.newListing[property] == undefined || this.newListing[property] == "" || this.newListing[property] == null){
        this.showToastDanger("All Fields are necessary")
        return;
      }
    }
    this.myLisitngService.addItemsToListings(this.newListing).toPromise().then(data=>{
      console.log(data);
      this.showToastSuccess()
      this.route.navigate(['listings']);
    })
      .catch(error=>console.log(error))
  }
  uploadEvent(){
    document.getElementById("fileUploadBut").click()
  }
  changeActiveNavbar(){
    document.getElementById("listingsNavbar").classList.remove("active")
    document.getElementById("sellNavbar").classList.add("active")
    document.getElementById("authNavbar").classList.remove("active")
    document.getElementById("messagesNavbar").classList.remove("active")
    document.getElementById("wishlistNavbar").classList.remove("active")
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
  showToastSuccess() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", "");
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
