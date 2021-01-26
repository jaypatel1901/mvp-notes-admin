import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { CMSComponent } from './cms/cms.component'
import { SubscriptionComponent } from './subscription/subscription.component'
import {PaymentComponent} from './payment/payment.component'
import {UsersDetailComponent} from './userDetails/userDetail.component'
import {MyAccountComponent} from './my-account/my-account.component'
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [ 
      {
        path:'',
        component:DashboardComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'cms',
        component: CMSComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionComponent,
      },
     
      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: 'user-details',
        component: UsersDetailComponent,
      },
      {
        path: 'myProfile',
        component: MyAccountComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
