import { Component, OnInit } from '@angular/core';
import { user } from '../service/user';
import {UserServiceService} from '../service/user-service.service';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import firebase from 'firebase/app';
import "firebase/auth";
import {AngularFireAuth} from '@angular/fire/auth';
import * as parser from 'fast-xml-parser';

@Component({
  selector: 'app-reqform',
  templateUrl: './reqform.component.html',
  styleUrls: ['./reqform.component.css']
})
export class ReqformComponent implements OnInit {
  loginuser:user=new user();
  emplid;
  empname;
  empemailid;
  supid;
  supname;
  supemailid;
  

  constructor(private userService: UserServiceService,private http: HttpClient,public auth: AngularFireAuth) { 
    //lets fetch details from peoplesoft
    this.loginuser=this.userService.getLocalStorageUser();
    console.log("User is "+ this.loginuser.displayname);
  }

  ngOnInit(): void {
    this.callPsoftData();
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
     console.log("Returning http response");
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

}//end of class
