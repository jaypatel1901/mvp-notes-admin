import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { CommonService } from '../../core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  
  error: any;
  invitationFormError = {
    "firstName": '',
    "lastName":'',
    "email": '',
    "subscriptionsId": ''
  }
  invitationForm: FormGroup
  user: any;
  userList: any = []
  totalUsage: any = ''
  planList: any = []
  paymentData: any = ''
  isBarChart: any = []
  isGold_Plan: any = []
  isSilver_Plan: any = []
  isTrial_Plan: any = []
  subscriptionSales: any = {}
  RecentTransactionsList:any=[]
  isSubscribers:any=[]
  filter=''
  isTotalUsage ={}
  TotalEngagementRate:number=0
  // paymentData:any =[]
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#FF0000',
      backgroundColor: null,
    },
    {
      borderColor: '#8E2AC0',
      // backgroundColor: '#8E2AC0',
    },
    {
      borderColor: '#F9966D',
      // backgroundColor: '#F9966D',
    },
  ];
  public barChartColors: Color[] = [
    {
      borderColor: '#009DE9',
      backgroundColor: '#009DE9',
    },
  ];
  public barChartLabels: Label[] = ['Jan 2021', 'Feb 2021', 'Mar 2021', 'Apr 2021', 'May 2021', 'Jun 2021', 'Jul 2021', 'Aug 2021', 'Oct 2021', 'Nov 2021', 'Dec 2021'];
  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Total Sales' },
  ];
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Gold Plan' },
    // { data: [], label: 'Silver Plan' },
    // { data: [], label: 'Trial Plan' },
  ];
  constructor(private commonService: CommonService, private fb: FormBuilder,private spinner: NgxSpinnerService) {
    this.createInvitation()
  }

  ngOnInit(): void {
    this.getUSerlist()
    this.getUsageStatistics()
    this.getSubscriptionPlanList()
    this.getSubscriptionReport()
    this.saleReportChart()
    this.getSubscriptionReportChart()
    this.SubscriptionsaleReportChart()
    this.getRecentTransactions()
    this.getSubscribers()
    this.getTotalEngagementRate()
  }
  inviationvalidationMessages = {
    'firstName': {
      'required': 'First Name is required',
      'minlength': 'minimum 3 characters required'
    },
    'lastName': {
      'required': 'Last Name is required',
      'minlength': 'minimum 3 characters required'
    },
    'email': {
      'required': 'email is required',
      'pattern': 'email not in valid format'
    },
    'subscriptionId': {
      'required': 'subscription Plan is required',
    }
  }
  createInvitation() {

    this.invitationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      subscriptionId: ['', [Validators.required]]
    })
    this.invitationForm.valueChanges.subscribe(data => this.onValueChanges(data))
  }
  onValueChanges(data?: any) {
    if (!this.invitationForm)
      return
    const form = this.invitationForm;
    for (const field in this.invitationFormError) {
      if (this.invitationFormError.hasOwnProperty(field)) {
        this.invitationFormError[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.inviationvalidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.invitationFormError[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  chartClicked(e: any): void {
    console.log('click', e);
  }
  chartHovered(e: any): void {
    console.log('hover', e);
  }

  onSendInvitation() {
    this.spinner.show();
    let userData = {
      firstName: this.invitationForm.value.firstName,
      lastName: this.invitationForm.value.lastName,
      email: this.invitationForm.value.email,
      subscriptionId: this.invitationForm.value.subscriptionId
    }
    console.log("onSendInvitation", userData)
    this.commonService.post('invatationUser',userData).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        alert("Invitation sent successfully!")
      } else {
        this.spinner.hide();
        alert(data.message)
      }
    })
  }
  getUSerlist() {
    this.commonService.get('getsubscriptionUser').subscribe((data: any) => {
      if (data.status == 200) {
        this.userList = data.result
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getUsageStatistics() {
    this.commonService.get('getUsageStatistics').subscribe((data: any) => {
      if (data.status == 200) {
        this.totalUsage = data.data
        this.totalUsage.map((item,i)=>{
          if(item.lable ==="totaldata"){
            this.isTotalUsage = item
          }
        })
             } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  onChange(event){
    this.isTotalUsage = {}
    this.filter = event.target.value
    this.totalUsage.map((item, index) => {
      if (item.lable=== this.filter) {
        this.isTotalUsage =item
      }
      if (this.filter === 'totaldata') {
        this.isTotalUsage =item
      }
    })
  }
  getSubscriptionPlanList() {
    this.commonService.get('getSubscriptionPlan').subscribe((data: any) => {
      if (data.status == 200) {
        this.planList = data.result
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getSubscriptionReport() {
    this.commonService.get('saleReport').subscribe((data: any) => {
      if (data.status == 200) {
        this.paymentData = data.data
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  saleReportChart() {
    this.commonService.get('getsaleChart').subscribe((data: any) => {
      if (data.status == 200) {
        let newData = data.data
      console.log("dataa in chart",newData)
        this.barChartData[0].data = newData.map(v => parseInt((v).toString()))
        console.log("dataa in chart",this.barChartData)

      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getSubscriptionReportChart() {
    this.commonService.get('subscriptionReport').subscribe((data: any) => {
      if (data.status == 200) {
        let newData = data.data.Silver_Plan
        let newData1 = data.data.Gold_Plan
        let newData2 = data.data.Trial_Plan
        this.lineChartData[0].data = newData1.map(v => parseInt((v).toString()))
        let dataGold = newData1.map(v => parseInt((v).toString()))
        let dataSilver = newData.map(v => parseInt((v).toString()))
        let datatrial = newData2.map(v => parseInt((v).toString()))
        this.lineChartData.push({ data: dataSilver, label: 'Silver Plan',borderColor: '#8E2AC0' })
        this.lineChartData.push({ data: datatrial, label: 'Trial Plan',  borderColor: '#F9966D'})
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  SubscriptionsaleReportChart() {
    this.commonService.get('subscriptionReport_data').subscribe((data: any) => {
      if (data.status == 200) {
        this.subscriptionSales = data.data
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  getSubscribers(){
    this.commonService.get(`getSubscribers`).subscribe((data: any)=>{
      if(data.data.length>0){
        this.isSubscribers=data.data
          }else{
        this.isSubscribers=[]
      }
    })
  }
  getRecentTransactions  () {
    this.commonService.get('getSubscriptionHistory').subscribe((data: any) => {
      if (data.status == 200) {
        this.RecentTransactionsList=data.data
      } else {
        alert(data.message)
      }
    })
  }
  getTotalEngagementRate  () {
    this.commonService.get('engagementRate').subscribe((data: any) => {
      if (data.status == 200) {
        this.TotalEngagementRate=data.data
        console.log("TotalEngagementRate",data)
      } else {
        alert(data.message)
      }
    })
  }


  
}
