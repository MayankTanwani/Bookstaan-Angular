import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ListingService} from "../listing/listing.service";
import {Listing} from "../Models/Listing";
import {WishlistService} from "../wishlist/wishlist.service";
import {MessageService} from "../message/message.service";
import {UserService} from "../user.service";
import {User} from "../Models/User";
import {MessageSend} from "../Models/MessageSend";
import {WishListSend} from "../Models/WishListSend";
@Component({
  selector: 'app-single-list',
  templateUrl: './single-list.component.html',
  styleUrls: ['./single-list.component.scss']
})
export class SingleListComponent implements OnInit {

  listingID;
  itemToDisplay : Listing = new Listing();
  messageText: string;
  sellingUser : User = new User();
  newMessage : MessageSend = new MessageSend();
  localUserDetails;
  currentUser : User;
  disableContactButton = false;
  constructor(private router : ActivatedRoute,private myMessageService : MessageService,
              private myUserService : UserService,
              private myWishlistService : WishlistService,
              private myListingService : ListingService,private route: Router) { }

  ngOnInit() {
    this.changeActiveNavbar()
    this.checkForCurrentUser()
    this.router.paramMap.subscribe((params : ParamMap) => {
      this.listingID = +(params.get('id'))
      console.log(this.listingID)
      this.myListingService.getSingleLisitng(this.listingID).toPromise().then((data : Listing[]) => {
        this.itemToDisplay = data[0];
        this.myUserService.getUserInfo(this.itemToDisplay.seller).toPromise().then((data : User) => {
          this.sellingUser = data;
          this.hideContactButton()
        }).catch((error) => console.log(error))
      }).catch((error) => this.route.navigate(['404']))
    })
  }

  changeActiveNavbar(){
    document.getElementById("listingsNavbar").classList.add("active")
    document.getElementById("sellNavbar").classList.remove("active")
    document.getElementById("authNavbar").classList.remove("active")
    document.getElementById("messagesNavbar").classList.remove("active")
    document.getElementById("wishlistNavbar").classList.remove("active")
  }

  addToWishList(){
    if(this.localUserDetails!=undefined && this.localUserDetails!=null){
      let newWishListItem = new WishListSend()
      newWishListItem.bookName = this.itemToDisplay.bookName
      newWishListItem.authorName = this.itemToDisplay.authorName
      newWishListItem.bookCondition = this.itemToDisplay.bookCondition
      newWishListItem.bookID = this.itemToDisplay.id
      newWishListItem.bookPic = this.itemToDisplay.image
      newWishListItem.price = this.itemToDisplay.price
      newWishListItem.userID = this.localUserDetails.id
      console.log(newWishListItem)
      this.myWishlistService.addWishListItems(newWishListItem).toPromise()
        .then(data => {
          this.showToast()
        })
        .catch(error => console.log(error))
    }else{
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

  sendMessage() {
    document.getElementById("closeButton").click()
    this.newMessage.bookID = this.itemToDisplay.id;
    this.newMessage.bookName = this.itemToDisplay.bookName
    this.newMessage.recipientID = this.itemToDisplay.seller
    this.newMessage.senderID = this.currentUser.id
    this.newMessage.senderName = this.currentUser.name
    this.newMessage.senderPic = this.currentUser.picture
    this.myMessageService.addNewMessage(this.newMessage).toPromise()
      .then((items) => console.log(items))
      .catch((error)=>console.log(error))
  }

  hideContactButton(){
    if(this.localUserDetails == undefined || this.localUserDetails == null){
      console.log("Not logged in")
      this.disableContactButton = true
    }
    if(this.localUserDetails.id == this.itemToDisplay.seller){
      console.log("Same user");
      this.disableContactButton = true
    }
  }

  checkCondiiton() : number{
    if(this.itemToDisplay.bookCondition == "New"){
      return 0
    }else if(this.itemToDisplay.bookCondition == "Almost New"){
      return 1
    }else if(this.itemToDisplay.bookCondition == "Slight Damage"){
      return 2;
    }else return 3;
  }
  showToast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  showInfoToast(message:string) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar2");
    // Add the "show" class to DIV
    x.innerText = message
    x.style.backgroundColor = "#00A3b9"
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}
