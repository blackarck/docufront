import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import {UserServiceService} from '../service/user-service.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { user } from '../service/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loginuser:user=new user();
  username:any="";
  photourl:String="";
  logouttxt="logout";
  opened: boolean;

  constructor(public auth: AngularFireAuth,private userService: UserServiceService,private router: Router,) { 
    this.auth=this.userService.auth;
    console.log("Setting login user");
    this.setloginuser();
   }

  setloginuser(){
    this.loginuser=this.userService.getLocalStorageUser();
    this.photourl=this.loginuser.photourl;
    this.username=this.loginuser.displayname;
  }

  ngOnInit(): void {
    console.log("Reinit login screen "+this.userService.mainuser.photourl);
  }


  logout(){
    this.auth.signOut();
    this.router.navigate(['/']);
    //console.log("Logging out user " +  this.auth.currentUser );
  }

  togglemenu(){
    if(this.opened){
      this.opened=false;
    }else{
      this.opened=true;
    } 
  }
}
