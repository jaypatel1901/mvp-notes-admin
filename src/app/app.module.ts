import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService, CommonService } from './core/services';
import { CommonModule } from "@angular/common";
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgxPaginationModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthGuardService, CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
