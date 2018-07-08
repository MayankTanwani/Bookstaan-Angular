import { Component, OnInit } from '@angular/core';
import {ListingService} from "./listing.service";
import {Listing} from "../Models/Listing";
import {ActivatedRoute, ParamMap, Router, RouterModule} from "@angular/router";
import {WishlistService} from "../wishlist/wishlist.service";
import {User} from "../Models/User";
import {WishListSend} from "../Models/WishListSend";
import {UserService} from "../user.service";
import {IonRangeSliderCallback} from "ng2-ion-range-slider";

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {

  listings: Listing[] = [];
  localUserDetails;
  currentUser: User;
  maxPrice = 10000;
  minPrice = 0;
  checkboxes = [true, true, true, true];
  bookNameText;
  authorNameText;
  optionsSelect: any[];
  sortOrder: any = "Oldest First";
  maxRangeValue: any = 20000;
  minRange: any = 0 ;
  maxRange : any = 20000;

  constructor(private myListingSerivce: ListingService,
              private myWishlistService: WishlistService,
              private myUserService: UserService,
              private router: ActivatedRoute,
              private route: Router) {
  }

  ngOnInit() {

    this.changeActiveNavbar()
    this.checkForCurrentUser()
    let minPriceParam;
    let maxPriceParam;
    let StringConditionParam

    this.router.queryParams.subscribe((params) => {
      if (Object.keys(params).length == 0) {
        this.getAllListings()
      }
      else {
        console.log("Filtering")
        if (params["minPrice"] != undefined || params["minPrice"] == null) {
          minPriceParam = parseFloat(params["minPrice"])
        } else {
          minPriceParam = 0;
        }
        if (params["maxPrice"] != undefined || params["maxPrice"] == null) {
          maxPriceParam = parseFloat(params["maxPrice"])
        } else {
          maxPriceParam = 2147483647
        }
        if (params["bookCondition"] != undefined || params["bookCondition"] != null) {
          StringConditionParam = params["bookCondition"];
        } else {
          StringConditionParam = "0000"
        }
        this.minRange = minPriceParam;
        this.maxRange = maxPriceParam;
        this.checkboxes = []
        for (let item of StringConditionParam) {
          this.checkboxes.push(Boolean(+item))
        }
        this.myListingSerivce.getFilterResults(this.minPrice, this.maxPrice, StringConditionParam).toPromise()
          .then((data: Listing[]) => {this.listings = data;if(this.listings.length!=0)
            this.maxRangeValue = Math.max.apply(Math,this.listings.map(item => item.price))})
      }
    });
  }

  calculateMaxValue(){
    if(this.listings.length==0){
      return;
    }
    console.log(this.listings)
    let max = Math.max.apply(Math,this.listings.map(item => item.price))
    this.maxRangeValue = max;
    this.maxRange = max;
    console.log(max);
  }
  getAllListings() {
    this.myListingSerivce.getAllListings().toPromise()
      .then((data: Listing[]) => {
        this.listings = data;
        this.calculateMaxValue();
      })
  }

  redirectList(id) {
    this.route.navigate([id], {relativeTo: this.router})
  }

  addToWishList(idx) {
    if (this.localUserDetails != undefined && this.localUserDetails != null) {
      let newWishListItem = new WishListSend()
      newWishListItem.bookName = this.listings[idx].bookName
      newWishListItem.authorName = this.listings[idx].authorName
      newWishListItem.bookCondition = this.listings[idx].bookCondition
      newWishListItem.bookID = this.listings[idx].id
      newWishListItem.bookPic = this.listings[idx].image
      newWishListItem.price = this.listings[idx].price
      newWishListItem.userID = this.localUserDetails.id
      this.myWishlistService.addWishListItems(newWishListItem).toPromise()
        .then(data => {
          this.showToast()
        })
        .catch(error => console.log(error))
    } else {
      this.route.navigate(['login'])
    }
  }

  checkCondiiton(item: Listing): number {
    if (item.bookCondition == "New") {
      return 0
    } else if (item.bookCondition == "Almost New") {
      return 1
    } else if (item.bookCondition == "Slight Damage") {
      return 2;
    } else return 3;
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
        .catch((error) => {console.log(error);this.route.navigate(['logout'])})
      return true
    }
  }

  changeActiveNavbar(){
    document.getElementById("listingsNavbar").classList.add("active")
    document.getElementById("sellNavbar").classList.remove("active")
    document.getElementById("authNavbar").classList.remove("active")
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

  filterByPrice(minQuery, maxQuery) {
    if (minQuery == "" && maxQuery == "") {
      console.log("Please input a range")
      return;
    } else {
      if (minQuery == "" || minQuery == undefined) {
        minQuery = 0
      }
      if (maxQuery == "" || maxQuery == undefined) {
        maxQuery = 2147483647
      }
      this.minPrice = parseFloat(minQuery)
      this.maxPrice = parseFloat(maxQuery)

      if (this.maxPrice < 0 || this.minPrice < 0 || this.maxPrice < this.minPrice) {
        this.showToastDanger("Invalid Range")
        return;
      }

      this.myListingSerivce.getFilterByPrice(this.minPrice, this.maxPrice).toPromise()
        .then((data: Listing[]) => this.listings = data)
        .catch(error => console.log(error))
    }
  }

  filterByCondition() {
    let stringVal = "";
    this.checkboxes.map((item) => stringVal += "" + +item)
    this.myListingSerivce.filterByCondtion(stringVal).toPromise()
      .then((data: Listing[]) => this.listings = data)
  }

  filterByBookName() {
    if (this.bookNameText == undefined) {
      this.showToastDanger("Please write a book name");
    }
    else {
      this.clearFilters()
      this.myListingSerivce.getItemsByBookName(this.bookNameText).toPromise()
        .then((data: Listing[]) => this.listings = data)
        .catch(error => console.log(error))
    }
  }

  filterByAuthorName() {
    if (this.authorNameText == undefined) {
      this.showToastDanger("Please write an author name");
    }
    else {
      this.clearFilters()
      this.myListingSerivce.getItemsByAuthorName(this.authorNameText).toPromise()
        .then((data: Listing[]) => this.listings = data)
        .catch(error => console.log(error))
    }
  }

  showToast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  showToastDanger(message: string) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar2");
    // Add the "show" class to DIV
    x.innerText = message
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  showToastInfo(message: string) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar2");
    // Add the "show" class to DIV
    x.innerText = message
    x.className = "show"
    x.style.backgroundColor = "#00A3b9"
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  filterByBoth(minQuery, maxQuery) {
    {
      if (minQuery == "" || minQuery == undefined) {
        minQuery = 0
      }
      if (maxQuery == "" || maxQuery == undefined) {
        maxQuery = 2147483647
      }
      this.minPrice = this.minRange;
      this.maxPrice = this.maxRange;

      if (this.maxPrice < 0 || this.minPrice < 0 || this.maxPrice < this.minPrice) {
        this.showToastDanger("Invalid Range")
        return;
      }
      console.log(this.checkboxes)
      let bookConditionString: string = "";
      this.checkboxes.map((item) => bookConditionString += "" + +item)
      console.log(bookConditionString)
      this.route.navigate(['listings'],{
        queryParams : {
          minPrice : this.minPrice,
          maxPrice : this.maxPrice,
          bookCondition : bookConditionString
        }
      })
    }
  }

  clearFilters() {
    this.minRange = 0;
    this.maxRange = this.maxRangeValue
    this.checkboxes = [true,true,true,true]
    this.route.navigate(['listings'])
  }

  clearBookName(minField,maxField) {
    this.bookNameText = "";
    this.filterByBookName()
    this.clearFilters()
  }
  clearAuthorName(minField,maxField) {
    this.authorNameText = '';
    this.filterByAuthorName()
    this.clearFilters()
  }

  getAllListingsNow(){
    this.myListingSerivce.getAllListings().toPromise()
      .then((items : Listing[]) => this.listings = items)
      .catch(error => console.log(error))
  }

  applySort() {
    console.log("Sorting");
    console.log(this.sortOrder)
    if(this.sortOrder == "Oldest First") {
      this.myListingSerivce.getAllListings().toPromise()
        .then((items : Listing[]) => this.listings = items)
        .catch(error => console.log(error))
    }else if(this.sortOrder == "Newest First"){
      this.myListingSerivce.getAllListings().toPromise()
        .then((items : Listing[]) => this.listings  = items.reverse())
        .catch(error => console.log(error))
    }else if(this.sortOrder == "Price low to high"){
      this.myListingSerivce.getAllListings().toPromise()
        .then((items : Listing[]) => this.listings  = items.sort(function (a,b) {
          return a.price-b.price
        }))
        .catch(error => console.log(error))
    }else if(this.sortOrder == "Price high to low"){
      this.myListingSerivce.getAllListings().toPromise()
        .then((items : Listing[]) => this.listings  = items.sort(function (a,b) {
          return b.price-a.price
        }))
        .catch(error => console.log(error))
    }
  }

  sliderChange(event: IonRangeSliderCallback) {
    this.minRange = event.from;
    this.maxRange = event.to
  }
}

