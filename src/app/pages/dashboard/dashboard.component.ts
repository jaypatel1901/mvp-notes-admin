import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { CommonService } from '../../core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import SlimSelect from 'slim-select'
import { RandomColor } from 'angular-randomcolor';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']

})
export class DashboardComponent implements OnInit {

  error: any;
  invitationFormError = {
    "firstName": '',
    "lastName": '',
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
  RecentTransactionsList: any = []
  isSubscribers: any = []
  filter = ''
  isTotalUsage = {}
  TotalEngagementRate: number = 0
  Plans: any = []
  filterData = []
  userName: any = ''
  userEmail: any = ''
  isfilterchangeSales =
    {
      label: 'All Time',
      startDate: '2020-11-25T11:31:07.431Z',
      endDate: new Date()
    }
  isfilterchange = {
    label: 'All Time',
    startDate: '2020-11-25T11:31:07.431Z',
    endDate: '2021-02-22T06:13:25.308Z'
  }
  // paymentData:any =[]
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  // public lineChartColors: Color[] = [
  //   {
  //     borderColor: '#FF0000',
  //     backgroundColor: null,
  //   },
  //   {
  //     borderColor: '#8E2AC0',
  //     // backgroundColor: '#8E2AC0',
  //   },
  //   {
  //     borderColor: '#F9966D',
  //     // backgroundColor: '#F9966D',
  //   },
  // ];
  public barChartColors: Color[] = [
    {
      borderColor: '#009DE9',
      backgroundColor: '#009DE9',
    },
  ];
  //  ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
  public barChartLabels: Label[] = []//['Jan 2021', 'Feb 2021', 'Mar 2021', 'Apr 2021', 'May 2021', 'Jun 2021', 'Jul 2021', 'Aug 2021', 'Oct 2021', 'Nov 2021', 'Dec 2021']
  public lineChartLabels: Label[] = []
  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Total Sales' },
  ];
  public lineChartData: ChartDataSets[] = [
    // { data: [], label: 'Gold Plan' },
    // { data: [], label: 'Silver Plan' },
    // { data: [], label: 'Trial Plan' },
  ];
  constructor(private commonService: CommonService, private fb: FormBuilder, private spinner: NgxSpinnerService, private router: Router) {
    this.createInvitation()
  }

  ngOnInit(): void {
    const token = localStorage.getItem("adminToken")
    if (!token)
      this.router.navigate(['login'])

    let fName = localStorage.getItem("firstName");
    let lName = localStorage.getItem("lastName");
    this.userEmail = localStorage.getItem('email')
    this.userName = fName + " " + lName
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
    this.getChartFilter()
    new SlimSelect({
      select: '#user-toggle',
      showSearch: false,
    })
    new SlimSelect({
      select: '#Total-subscription',
      showSearch: false,
    })
    new SlimSelect({
      select: '#slim-select',
      showSearch: false,
    })
    new SlimSelect({
      select: '#modal-subscription',
      showSearch: false,
    })
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
    this.commonService.post('invatationUser', userData).subscribe((data: any) => {
      if (data.status == 200) {
        this.spinner.hide();
        document.getElementById("myModal").click();
        swal.fire("Invitation sent successfully!");
      } else {
        this.spinner.hide();
        document.getElementById("myModal").click();
        swal.fire("Server Error");
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
    this.spinner.show()

    this.commonService.get('getUsageStatistics').subscribe((data: any) => {
      if (data.status == 200) {
        this.totalUsage = data.data
        this.totalUsage.map((item, i) => {
          if (item.lable === "totaldata") {
            this.isTotalUsage = item
            this.spinner.hide();
          }
        })
      } else {
        this.error = data.message
        this.spinner.hide();
        alert(this.error)
      }
    })
  }
  onChange(event) {
    this.isTotalUsage = {}
    this.filter = event.target.value
    this.totalUsage.map((item, index) => {
      if (item.lable === this.filter) {
        this.isTotalUsage = item
      }
      // if (this.filter === 'totaldata') {
      //   this.isTotalUsage =item
      // }
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
  onChangeSalefilter(event) {

    console.log("chekcc itme", event.target.value)
    let isFilter = event.target.value
    if (isFilter !== null) {
      let newdata = []
      newdata = this.filterData.filter((item) => {
        return item.label === isFilter
      });
      this.isfilterchangeSales = newdata[0]
      this.saleReportChart()
    }
  }
  saleReportChart() {
    this.spinner.show();

    this.commonService.post('getsaleChart', this.isfilterchangeSales).subscribe((data: any) => {
      if (data.status == 200) {
        this.barChartData = []
        let newData = data.data
        console.log("dataa in chart", newData)
        this.barChartLabels = newData.chartLabel
        this.barChartData.push({
          data: newData.total, label: 'Gold Plan'
        })
        this.spinner.hide();

        // this.barChartData[0].data = newData.map(v => parseInt((v).toString()))
        console.log("dataa in chart1111", this.barChartData)
      } else {
        this.error = data.message
        this.spinner.hide();
        alert(this.error)
      }
    })
  }
  getChartFilter() {
    this.commonService.get('chartFilter').subscribe((data: any) => {
      if (data.status == 200) {
        this.filterData = data.data
      } else {
        this.error = data.message
        alert(this.error)
      }
    })
  }
  onChangefilter(event) {
    let isFilter = event.target.value
    if (isFilter !== null) {
      let newdata = []
      newdata = this.filterData.filter((item) => {
        return item.label === isFilter
      });
      this.isfilterchange = newdata[0]
      this.getSubscriptionReportChart()
    }
  }
  getSubscriptionReportChart() {
    this.spinner.show();
    this.lineChartData = []
    this.commonService.post('subscriptionReport', this.isfilterchange).subscribe((data: any) => {
      if (data.status == 200) {
        this.Plans = data.data
        data.data.map((item, i) => {
          const newColor = RandomColor.generateColor()
          this.lineChartLabels = item.chartLabel
          this.lineChartData.push({ data: item.total, label: item.name, borderColor: newColor })
        })
        this.spinner.hide();

        // let newData = data.data.Silver_Plan
        // let newData1 = data.data.Gold_Plan
        // let newData2 = data.data.Trial_Plan
        // this.lineChartData[0].data = newData1.map(v => parseInt((v).toString()))
        // let dataGold = newData1.map(v => parseInt((v).toString()))
        // let dataSilver = newData.map(v => parseInt((v).toString()))
        // let datatrial = newData2.map(v => parseInt((v).toString()))
        // data.map
        // this.lineChartData.push({ data: dataSilver, label: 'Silver Plan',borderColor: '#8E2AC0' })
        // this.lineChartData.push({ data: datatrial, label: 'Trial Plan',  borderColor: '#F9966D'})
      } else {
        this.error = data.message
        this.spinner.hide();
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
  getSubscribers() {
    this.commonService.get(`getSubscribers`).subscribe((data: any) => {
      if (data.data.length > 0) {
        this.isSubscribers = data.data
      } else {
        this.isSubscribers = []
      }
    })
  }
  getRecentTransactions() {
    this.commonService.get('getSubscriptionHistory').subscribe((data: any) => {
      if (data.status == 200) {
        this.RecentTransactionsList = data.data
      } else {
        alert(data.message)
      }
    })
  }
  getTotalEngagementRate() {
    this.spinner.show();
    this.commonService.get('engagementRate').subscribe((data: any) => {
      if (data.status == 200) {
        this.TotalEngagementRate = data.data
        this.spinner.hide();

      } else {
        this.spinner.hide();
        alert(data.message)
      }
    })
  }

  logout() {

    Swal.fire({
      title: "Are you sure?",
      // text: "Once deleted, you will not be able to recover this imaginary file!",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes,Logout it!'
    })
      .then((willDelete) => {
        if (willDelete.value) {
          localStorage.removeItem("token");
          this.router.navigate(['login'])
        }
        else {
          Swal.fire("Fail");
        }
        console.log(willDelete)
      });
  }

}