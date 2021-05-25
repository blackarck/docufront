import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {UserServiceService} from '../service/user-service.service';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit {

  custarr= [];
  custarr1=[];
  dataSource = new MatTableDataSource( this.custarr1);
  displayedColumns: string[] = ['formid','apprvname','apprvemailid','itemdescr','itemvalue','requestdttm','formsts'];

  constructor(private userService: UserServiceService,private http: HttpClient,public auth: AngularFireAuth,
    private changeDetectorRefs: ChangeDetectorRef , ) { 
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
        
          console.log("res is "+JSON.stringify(res.content));
         
          for(var i in res.content){
            var form1:formdata=res.content[i];
            this.custarr.push(form1);
          }//end of for
          this.dataSource = new MatTableDataSource( this.custarr);
        } ,
        (err)=> {
          
          console.log(err.error.message);
        }
      );

    });

  }//end of getFormData

  applyFilter(filterValue: { target: HTMLInputElement }) {
    this.dataSource.filter = (filterValue.target).value.trim().toLowerCase();
  }

}//end of class

export class formdata{
  formid:String;
  apprvname:String ;
  apprvemailid:String ;
  itemdescr:String;
  itemvalue:Number;
  requestdttm:String;
  formsts:string;
};
