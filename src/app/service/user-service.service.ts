import { Injectable } from '@angular/core';
import { user } from './user';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  mainuser:user=new user();

  constructor(public auth: AngularFireAuth, private http: HttpClient  ) { 
  }

  setuser(takeuser:any ){
    this.getUserIDToken().then((res)=>{
      localStorage.setItem('userid', takeuser.email);
      localStorage.setItem('token', res);
      localStorage.setItem('photourl',takeuser.photoURL);
      localStorage.setItem('displayname',takeuser.displayName);
    });
    //console.log("This.auth in userservice "+this.auth.currentUser + " coming from "+authsrvc.currentUser);
    this.mainuser.displayname=takeuser.displayName;
    this.mainuser.emailid=takeuser.email;
    this.mainuser.photourl= takeuser.photoURL;
    this.mainuser.userid='';
  }

  getLocalStorageUser():user{
    let retuser:user=new user();
    retuser.userid= localStorage.getItem('userid');
    retuser.displayname=localStorage.getItem('displayname');
    retuser.photourl=localStorage.getItem('photourl');
    
    return retuser;
  }

  getUserIDToken():any{
    return firebase.auth().currentUser?.getIdToken(true);
  }

  googleLogin():any{
    //original code working
    // return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()) ;
    return new Promise((resolve,reject)=>{
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res)=>{
      //console.log("google user "+ JSON.stringify(res.user))
      this.setuser(res.user );
      console.log("User set is "+ this.mainuser.displayname);
      resolve(this.fetchuserdata());
     }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       reject(errorCode);
       var errorMessage = error.message;
       // The email of the user's account used.
       var email = error.email;
       // The firebase.auth.AuthCredential type that was used.
       var credential = error.credential;
       if (errorCode === 'auth/account-exists-with-different-credential') {
         alert('You have signed up with a different provider for that email.');
         // Handle linking here if your app allows it.
       } else {
         console.error(error);
       };
     });
    })
  }//end of function google login

  twittlogin():any{
    return new Promise((resolve,reject)=>{
      this.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider()).then((res)=>{
      //console.log("google user "+ JSON.stringify(res.user))
      this.setuser(res.user );
      console.log("User set is "+ this.mainuser.displayname);
      resolve(this.fetchuserdata());
     }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       reject(errorCode);
       var errorMessage = error.message;
       // The email of the user's account used.
       var email = error.email;
       // The firebase.auth.AuthCredential type that was used.
       var credential = error.credential;
       if (errorCode === 'auth/account-exists-with-different-credential') {
         alert('You have signed up with a different provider for that email.');
         // Handle linking here if your app allows it.
       } else {
         console.error(error);
       };
     });
    })
  }

  gittlogin():any{
    return new Promise((resolve,reject)=>{
      this.auth.signInWithPopup(new firebase.auth.GithubAuthProvider()).then((res)=>{
      //console.log("google user "+ JSON.stringify(res.user))
      this.setuser(res.user );
      console.log("User set is "+ this.mainuser.displayname);
      resolve(this.fetchuserdata());
     }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       reject(errorCode);
       var errorMessage = error.message;
       // The email of the user's account used.
       var email = error.email;
       // The firebase.auth.AuthCredential type that was used.
       var credential = error.credential;
       if (errorCode === 'auth/account-exists-with-different-credential') {
         alert('You have signed up with a different provider for that email.');
         // Handle linking here if your app allows it.
       } else {
         console.error(error);
       };
     });
    })
  }

fetchuserdata():any{
  return new Promise((resolve, reject )=>{
    const APIendpoint=environment.APIEndpoint;
    const posturl = APIendpoint+'/api/user/login';
    let usridtoken:any;
    
   this.getUserIDToken()?.then((res)=>{
     usridtoken=res;
     //console.log("Id token recieved");
   }).then(()=>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
        'authorization': usridtoken
      })
    };//end of httpoptions
    console.log("Returning http response");
    resolve (this.http.post<any>(posturl,JSON.stringify(this.mainuser),httpOptions));
  
  });
 
   /*
   
   ?.then((res)=>{
      usridtoken=res;
      console.log("Recieved id token " + JSON.stringify(res));
    })
    
    console.log("After await getidtoken ");
  
});//end of fetchc user dat
*/
  });//end of promise
}//end of fetchuserdata


}//end of main class
