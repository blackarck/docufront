import { Component, OnInit ,Inject} from '@angular/core';
import { user } from '../service/user';
import {UserServiceService} from '../service/user-service.service';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import firebase from 'firebase/app';
import "firebase/auth";
import {AngularFireAuth} from '@angular/fire/auth';
import * as parser from 'fast-xml-parser';
import {itemlist} from './itemlist';
import {FormBuilder, FormControl,Validators ,FormGroup} from '@angular/forms';
import {MatSnackBar ,  MatSnackBarHorizontalPosition,  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router ,ActivatedRoute} from '@angular/router';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-reqform',
  templateUrl: './reqform.component.html',
  styleUrls: ['./reqform.component.css']
})
export class ReqformComponent implements OnInit {
  loginuser:user=new user();
  emplid="1002";
  empname="Nancy Drew";
  empemailid="blackarck@gmail.com";
  supid="1001";
  supname="Sherlock Holmes";
  supemailid="sirmondatawriter@gmail.com";
  hodid="2002";
  hodname="Conan Doyle"
  hodemail="sirmondatawriter@gmail.com";

  approverid;
  approveremail;
  approvername;
  submitdisable= true;
  selectedValue;
  selecteddescr;
  itemlist=itemlist;
  messagetxt="";
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private userService: UserServiceService,private http: HttpClient,public auth: AngularFireAuth, private fb: FormBuilder,
    private _snackBar: MatSnackBar,public dialog: MatDialog,private router: Router,private route: ActivatedRoute) { 
    //lets fetch details from peoplesoft
    this.loginuser=this.userService.getLocalStorageUser();
    console.log("User is "+ this.loginuser.displayname);
    //console.log(' itemlist count '+itemlist.length );
  }

  ngOnInit(): void {
    this.approverid=this.supid;
  this.approveremail=this.supemailid;
  this.approvername=this.supname;
    // this.callPsoftData(); //make sure test server is up
  
  }

  callPsoftData(){
    const APIendpoint = environment.APIEndpoint;
    const posturl=APIendpoint+'/api/forms/getpsoftdata';
    let usridtoken:any;
    
    this.auth.idToken.subscribe((res)=>{
      usridtoken=res;
      //console.log("Id token recieved " +usridtoken );
    
     // console.log("Id token recieved " +usridtoken );
     let httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json',
         'Access-Control-Allow-Origin':'*',
         'Access-Control-Allow-Methods': 'GET, POST, PUT',
         'authorization': usridtoken
       })
     };//end of httpoptions
     // console.log("Returning http response");
     this.http.get<any>(posturl, httpOptions).subscribe(
      (res)=> {
        console.log("res is "+JSON.stringify(res));
        var xmldoc=res.psoftdata;
        var jsonObj = parser.parse(xmldoc );
        console.log("JSON obj is "+ JSON.stringify(jsonObj));
        
        this.emplid= jsonObj.Get__CompIntfc__Z_DOCUPOC_CI2Response.EMPLID;
        console.log("Employee id is "+ this .emplid);
        this.empname = jsonObj.Get__CompIntfc__Z_DOCUPOC_CI2Response.EMPLNAME;
        this.empemailid = jsonObj.Get__CompIntfc__Z_DOCUPOC_CI2Response.EMAILID;
        this.supid = jsonObj.Get__CompIntfc__Z_DOCUPOC_CI2Response.SUPERVISOR_ID;
        this.supname = jsonObj.Get__CompIntfc__Z_DOCUPOC_CI2Response.SDK_NAME;
        this.supemailid  = jsonObj.Get__CompIntfc__Z_DOCUPOC_CI2Response.EMAIL_ADDR;

        
      } ,
      (err)=> {
        
        console.log(err.error.message);
      }
    );
   });
    
  }//end of callpsoftdatapost

  callPdfWrite(){
    const APIendpoint = environment.APIEndpoint;
    const posturl=APIendpoint+'/api/createsignpdf/signandpost';
    let usridtoken:any;

    var datatosend={
      empid1: this.emplid,
      empname1: this.empname,
      empemailid1: this.empemailid,
      approverid1: this.approverid,
      approveremail1: this.approveremail,
      approvername1: this.approvername,
      itemdescr1: this.selectedValue.descr,
      itemvalue1:this.selectedValue.value,
    };
    console.log("Sending this-"+datatosend);

    this.auth.idToken.subscribe((res)=>{
      usridtoken=res;
      //console.log("Id token recieved " +usridtoken );
    
     // console.log("Id token recieved " +usridtoken );
     let httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json',
         'Access-Control-Allow-Origin':'*',
         'Access-Control-Allow-Methods': 'GET, POST, PUT',
         'authorization': usridtoken
       })
     };//end of httpoptions
     this.http.post<any>(posturl,datatosend,httpOptions).subscribe(
      (res)=> {
        this.selectedValue="";
        console.log("Res body is "+JSON.stringify(res));
      } ,
      (err)=> {
        
        console.log(err.error.message);
      }
    );
  });
  }//end of function write pdf

  itemselected(itemvalue){
     //console.log("Item value is "+ itemvalue.value);
     if(itemvalue.value>0){this.submitdisable=false;}
     else{
      this.submitdisable=true;
     }
    if(itemvalue.value>1999){
      //show a snackbar approver will change
      this.openSnackBar("Approver changed ");
      this.approverid=this.hodid;
      this.approveremail=this.hodemail;
      this.approvername=this.hodname;
    }else{
      this.approverid=this.supid;
      this.approveremail=this.supemailid;
      this.approvername=this.supname;
    }
  }//end of itemselected

  openSnackBar(msgprompt) {
    
    this._snackBar.open(msgprompt, '', {
      duration: 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }//end of opensnackbar

  submitform(){
   //this.openSnackBar("Form Submitted");
   
   this.submitdisable=true;
     this.callPdfWrite();
   const dialogRef = this.dialog.open(SubmitDialog, {
    width: '400px'}
  );
  this.router.navigate(['./viewform'], { relativeTo: this.route.parent});
  }//end of submit form
}//end of class


@Component({
  selector: 'submit-dialog',
  templateUrl: 'submit-dialog.html',
})
export class SubmitDialog {
  constructor(  ) {}
}