import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  lifeTime: any
  today: any
  yesterDay: any
  week: any
  month: any
  paymentByPlan:any
  SubscriptionHistoryList:any
  constructor(private commonService: CommonService,private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.getPaymentData()
    this.getSubscriptionHistory()
    this.paymentManagementByPlan()
  }
  getPaymentData() {
    this.spinner.show();
    this.commonService.get(`paymentManagement`).subscribe((data: any) => {
      if (data.result.length > 0) {
        data.result.map((item, i) => {
          if (item.label == "lifeTime") {
            this.lifeTime = item.totalPrice
            console.log("datdaa",this.lifeTime)
          }
          if (item.label == "Today") {
            this.today = item.totalPrice
          } if (item.label == "yesterDay") {
            this.yesterDay = item.totalPrice
          } if (item.label == "week") {
            this.week = item.totalPrice
          } if (item.label == "month") {
            this.month = item.totalPrice
          } 
        })
        // this.plans = data.result
        this.spinner.hide();

      } else {
        this.spinner.hide();

        // this.plans = [];
      }
    })
  }
  getSubscriptionHistory() {
    this.spinner.show();
    this.commonService.get('getSubscriptionHistory').subscribe((data: any) => {
      if (data.status == 200) {
        console.log("datad  ")
        this.SubscriptionHistoryList = data.data
        // this.isSubscriptionHistoryList = data.data
        // console.log("this.isSubscriptionHistoryList",this.isSubscriptionHistoryList)
      } else {
        alert(data.message)
      }
    })
  }
  paymentManagementByPlan() {
    this.commonService.get('paymentManagementPlan').subscribe((data: any) => {
      if (data.status == 200) {
        console.log("datad  ")
        this.paymentByPlan = data.result
        // this.isSubscriptionHistoryList = data.data
        // console.log("this.isSubscriptionHistoryList",this.isSubscriptionHistoryList)
      } else {
        alert(data.message)
      }
    })
  }
}
