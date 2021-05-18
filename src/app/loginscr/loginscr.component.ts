import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import {UserServiceService} from '../service/user-service.service';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatSnackBar ,  MatSnackBarHorizontalPosition,  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';


const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
const twitterlogoURL = "https://cdn.jsdelivr.net/npm/simple-icons@v4/icons/twitter.svg";
const ghublogoURL="https://cdn.jsdelivr.net/npm/simple-icons@v4/icons/github.svg";

@Component({
  selector: 'app-loginscr',
  templateUrl: './loginscr.component.html',
  styleUrls: ['./loginscr.component.css']
})
export class LoginscrComponent implements OnInit {


  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  constructor( private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,public auth: AngularFireAuth, private userService: UserServiceService,
    private http: HttpClient,  private router: Router,  private _snackBar: MatSnackBar) { 
    this.matIconRegistry.addSvgIcon( "glogo", this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
    this.matIconRegistry.addSvgIcon( "tlogo", this.domSanitizer.bypassSecurityTrustResourceUrl(twitterlogoURL));
    this.matIconRegistry.addSvgIcon( "gitlogo", this.domSanitizer.bypassSecurityTrustResourceUrl(ghublogoURL));
  }

  ngOnInit(): void {
  }

  login() {
    this.userService.googleLogin().then((res)=>{
      //res is the http observable returned from fetchuser in userservices
      res.subscribe((res1)=>{
        this.showDashboard(res1);
        //console.log("Value of res is "+JSON.stringify(res1));
      });
    });
  }

  showDashboard(res1:any){
    if (res1.success){
      // console.log("it was a success");
        if(res1.usrexist|| res1.usrcreated){
          //take user to dashboard else show messag to try again
          this.router.navigate(['/dashboard']);
        }else{
         this.openSnackBar("Something went wrong please try again.");
        }
     } else{
       //do nothing and show the error message
       this.openSnackBar("Something went wrong please try again.");
     }
  }//end of showdashboarad

  tlogin(){
    this.userService.twittlogin().then((res)=>{
      res.subscribe((res1)=>{
        this.showDashboard(res1);
        //console.log("Value of res is "+JSON.stringify(res1));
      });
    });
  }

  gitlogin(){
    this.userService.gittlogin().then((res)=>{
      res.subscribe((res1)=>{
        this.showDashboard(res1);
        //console.log("Value of res is "+JSON.stringify(res1));
      });
    });
  }

  
  logout() {
    this.auth.signOut();
  }

  openSnackBar(msgprmpt:string) {
    this._snackBar.open(msgprmpt, '', {
      duration: 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }//end of opensnackbar

}//end of class
