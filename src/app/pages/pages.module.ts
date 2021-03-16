import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {DashboardContainerComponent} from './dashboard/dashboard-container/dashboard-container.component';
import { UsersComponent } from './users/users.component';
import { CMSComponent } from './cms/cms.component';
import { SubscriptionComponent } from './subscription/subscription.component'
import {PaymentComponent} from './payment/payment.component'
import {MyAccountComponent} from './my-account/my-account.component'
import {UsersDetailComponent} from './userDetails/userDetail.component'
import {ViewPerfomanceComponent} from './viewPerformance/viewPerfomance.component'
import { SidebarComponent } from '../shared';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgChartjsModule } from 'ng-chartjs';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from "ngx-spinner";
import { RandomcolorModule } from 'angular-randomcolor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FilterPipe} from './filter.pipe';
import { Daterangepicker } from 'ng2-daterangepicker';
import{HeaderComponent} from '../shared'
// import { Daterangepicker } from 'ng2-daterangepicker';

// import * as ChartAnnotation from 'chartjs-plugin-annotation';
@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    HeaderComponent,
    DashboardContainerComponent,
    UsersComponent,
    CMSComponent,
    SubscriptionComponent,
    SidebarComponent,
    PaymentComponent,
    UsersDetailComponent,
    MyAccountComponent,
    ViewPerfomanceComponent,
    FilterPipe
  ], 
  imports: [
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    CommonModule,
    PagesRoutingModule,
    NgChartjsModule,
    ChartsModule,
    NgxSpinnerModule,
    RandomcolorModule,
    SweetAlert2Module,
    Daterangepicker
  ]
})
export class PagesModule { }
