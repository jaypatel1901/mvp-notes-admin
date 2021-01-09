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
import { SidebarComponent } from '../shared';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgChartjsModule } from 'ng-chartjs';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from "ngx-spinner";
import { RandomcolorModule } from 'angular-randomcolor';
// import * as ChartAnnotation from 'chartjs-plugin-annotation';
@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    DashboardContainerComponent,
    UsersComponent,
    CMSComponent,
    SubscriptionComponent,
    SidebarComponent
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
    RandomcolorModule
  ]
})
export class PagesModule { }
