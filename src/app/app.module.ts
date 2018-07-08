import { BrowserModule } from '@angular/platform-browser';
import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { MessageComponent } from './message/message.component';
import { ListingComponent } from './listing/listing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { SingleListComponent } from './single-list/single-list.component';
import {MessageService} from './message/message.service';
import {ListingService} from './listing/listing.service';
import {WishlistService} from './wishlist/wishlist.service';
import {UserService} from "./user.service";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {Route, RouterModule, Routes} from "@angular/router";

import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { HomeComponent } from './home/home.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import {ImageZoomModule} from 'angular2-image-zoom';
import { UserListingsComponent } from './user-listings/user-listings.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {IonRangeSliderModule} from "ng2-ion-range-slider";
import { Page404Component } from './page404/page404.component';

const routes : Routes = [
  {
    path : '',
    redirectTo : 'home',
    pathMatch : 'full'
  },
  {
    path : 'home',
    component : HomeComponent,
    data : {state : 'home'}
  },
  {
    path : 'login',
    component : LoginComponent,
    data : {state : 'login'}
  },
  {
    path : 'signup',
    component : SignupComponent,
    data : {state : 'signup'}
  },
  {
    path : 'messages',
    component : MessageComponent,
    data : {state : 'messages'}
  },
  {
    path : 'wishlist',
    component : WishlistComponent,
    runGuardsAndResolvers : 'always',
    data : {state : 'wishlist'}
  },
  {
    path : 'listings',
    component : ListingComponent,
    data : {state : 'listings'}
  },
  {
    path : 'listings/add',
    component : AddListingComponent,
    data : {state : 'listings-add'}
  },
  {
    path : 'listings/:id',
    component : SingleListComponent,
    data : {state : 'listings-id'}
  },
  {
    path : 'logout',
    component : LogoutComponent,
    data : {state : 'logout'}
  },
  {
    path : 'profile',
    component : ProfileComponent,
    data : {state : 'profile'}
  },
  {
    path : 'profile/listings',
    component : UserListingsComponent,
    data : {state : 'profile-listings'}
  },
  {
    path : '404',
    component : Page404Component
  }
]

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    ListingComponent,
    LoginComponent,
    SignupComponent,
    WishlistComponent,
    AddListingComponent,
    SingleListComponent,
    HomeComponent,
    LogoutComponent,
    ProfileComponent,
    UserListingsComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MDBBootstrapModule.forRoot(),
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyCmVmsYREtsKfwPKSkFggmEJ9xuGHwkm4s',
      authDomain: 'fileuploader-3159c.firebaseapp.com',
      databaseURL: 'https://fileuploader-3159c.firebaseio.com',
      projectId: 'fileuploader-3159c',
      storageBucket: 'fileuploader-3159c.appspot.com',
      messagingSenderId: '768618514345'
    }),
    AngularFireStorageModule,
    ImageZoomModule,
    IonRangeSliderModule
  ],
  schemas : [NO_ERRORS_SCHEMA],
  providers: [MessageService, ListingService, WishlistService,UserService,AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
