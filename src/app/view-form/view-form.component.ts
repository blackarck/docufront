import { Component, OnInit } from '@angular/core';
import {UserServiceService} from '../service/user-service.service';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';


@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit {

  constructor(private userService: UserServiceService,private http: HttpClient,public auth: AngularFireAuth,) { 
    this.getFormData();
  }

  ngOnInit(): void {
  }


  getFormData(){
    const APIendpoint = environment.APIEndpoint;
    const posturl=APIendpoint+'/api/createsignpdf/getdocstatus';
    let usridtoken:any;

    this.auth.idToken.subscribe((res)=>{
      usridtoken=res;

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT',
          'authorization': usridtoken
        })
      };//end of httpoptions

      this.http.get<any>(posturl, httpOptions).subscribe(
        (res)=> {
        
          console.log("res is "+JSON.stringify(res));
        } ,
        (err)=> {
          
          console.log(err.error.message);
        }
      );

    });

  }//end of getFormData
}//end of class
