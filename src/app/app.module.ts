import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { LoginscrComponent } from './loginscr/loginscr.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReqformComponent } from './reqform/reqform.component';


const appRoutes: Routes = [
  { path: 'loginscr', component: LoginscrComponent },
  {path: 'dashboard', component: DashboardComponent,
   children:[
     {path:'reqform', component:ReqformComponent},
   ]},
  { path: '', redirectTo: '/loginscr', pathMatch: 'full'  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginscrComponent,
    DashboardComponent,
    ReqformComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule,
  ],
  exports:[
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
  ],
  entryComponents:[],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
